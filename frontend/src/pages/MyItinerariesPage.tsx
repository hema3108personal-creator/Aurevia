import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Itinerary } from '../types';

export const MyItinerariesPage: React.FC = () => {
  const { user } = useAuth();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItineraries = () => {
    if (!user) return;
    setLoading(true);
    api.getItineraries(user.id)
      .then((res) => {
        if (res.success && res.itineraries) {
          setItineraries(res.itineraries);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItineraries();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this travel itinerary?')) return;
    try {
      await api.deleteItinerary(id);
      fetchItineraries();
    } catch (err: any) {
      alert(err.message || 'Failed to delete itinerary');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-100">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">My Travel Itineraries</h1>
          <p className="text-xs text-muted mt-1">
            Day-by-day sightseeing timelines and attraction plans saved in Itinerary Service.
          </p>
        </div>

        <Link
          to="/dashboard/itineraries/create"
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Itinerary</span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-44 animate-pulse border border-ivory-100 p-6"></div>
          ))}
        </div>
      ) : itineraries.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 border border-ivory-100">
          <CalendarDays className="w-12 h-12 text-muted mx-auto" />
          <h3 className="font-serif text-lg font-bold text-navy-900">No Itineraries Planned</h3>
          <p className="text-xs text-muted leading-relaxed">
            Create structured daily sightseeing plans, add attractions, and organize your railway transfers.
          </p>
          <Link
            to="/dashboard/itineraries/create"
            className="inline-block bg-navy-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl"
          >
            Start Planning Now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {itineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-100 shadow-sm space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ivory-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-md">
                      {itinerary.numberOfDays} Days Plan
                    </span>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gold-500" />
                      {itinerary.startDate} to {itinerary.endDate}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-navy-900 mt-1">
                    {itinerary.title}
                  </h3>
                  <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gold-500" />
                    <span>Destination: <strong>{itinerary.destinationName}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => handleDelete(itinerary.id)}
                    className="p-2 text-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete Itinerary"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notes */}
              {itinerary.notes && (
                <p className="text-xs text-navy-800/80 bg-ivory-50/70 p-3.5 rounded-xl border border-ivory-100 italic">
                  "{itinerary.notes}"
                </p>
              )}

              {/* Daily Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Daily Sightseeing Timeline
                </h4>

                <div className="space-y-3">
                  {itinerary.activities && itinerary.activities.length > 0 ? (
                    itinerary.activities.map((act) => (
                      <div
                        key={act.id}
                        className="p-4 bg-ivory-50/50 rounded-2xl border border-ivory-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-3">
                          <span className="bg-navy-900 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] flex-shrink-0">
                            Day {act.dayNumber}
                          </span>
                          <div>
                            <div className="font-bold text-sm text-navy-900">{act.activityTitle}</div>
                            {act.description && <div className="text-muted mt-0.5">{act.description}</div>}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-muted self-end sm:self-center">
                          {act.timeSlot && <span>{act.timeSlot}</span>}
                          <span>({act.durationMinutes} mins)</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-muted italic">No activities added to this itinerary yet.</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
