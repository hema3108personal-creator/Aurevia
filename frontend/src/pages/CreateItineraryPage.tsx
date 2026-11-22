import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  CalendarDays,
  Plus,
  Trash2,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Destination, ItineraryActivity } from '../types';

export const CreateItineraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const preselectedDestId = searchParams.get('destId') || '';
  const preselectedDestName = searchParams.get('destName') || '';

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [title, setTitle] = useState(
    preselectedDestName ? `${preselectedDestName} Scenic Getaway` : 'My Custom Journey'
  );
  const [destinationId, setDestinationId] = useState(preselectedDestId || 'dest_munnar');
  const [destinationName, setDestinationName] = useState(preselectedDestName || 'Munnar');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [numberOfDays, setNumberOfDays] = useState(3);
  const [notes, setNotes] = useState('Scenic nature walking, local culinary tastings, and cultural sightseeing.');

  const [activities, setActivities] = useState<Array<Omit<ItineraryActivity, 'id'>>>([
    {
      dayNumber: 1,
      activityTitle: 'Arrival & Hotel Check-in',
      description: 'Transfer from rail terminus and check into eco-lodge.',
      timeSlot: '11:00 AM',
      durationMinutes: 120,
      orderIndex: 0,
    },
    {
      dayNumber: 1,
      activityTitle: 'Local Sightseeing & Tea Tasting',
      description: 'Explore plantation gardens and historic museum factory.',
      timeSlot: '03:00 PM',
      durationMinutes: 120,
      orderIndex: 1,
    },
    {
      dayNumber: 2,
      activityTitle: 'National Park Wildlife Safari',
      description: 'Early morning wildlife trail across mountain sanctuary.',
      timeSlot: '08:30 AM',
      durationMinutes: 240,
      orderIndex: 0,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getDestinations().then((res) => {
      if (res.success && res.destinations) {
        setDestinations(res.destinations);
        if (!preselectedDestId && res.destinations.length > 0) {
          setDestinationId(res.destinations[0].id);
          setDestinationName(res.destinations[0].name);
        }
      }
    }).catch(() => {});
  }, [preselectedDestId]);

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dId = e.target.value;
    const dest = destinations.find((d) => d.id === dId);
    setDestinationId(dId);
    if (dest) {
      setDestinationName(dest.name);
      setTitle(`${dest.name} Discovery Journey`);
    }
  };

  const handleAddActivity = () => {
    setActivities([
      ...activities,
      {
        dayNumber: Math.min(numberOfDays, activities.length ? activities[activities.length - 1].dayNumber : 1),
        activityTitle: '',
        description: '',
        timeSlot: '10:00 AM',
        durationMinutes: 90,
        orderIndex: activities.length,
      },
    ]);
  };

  const handleActivityChange = (index: number, field: string, value: any) => {
    const updated = [...activities];
    (updated[index] as any)[field] = value;
    setActivities(updated);
  };

  const handleRemoveActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be signed in to create an itinerary');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.createItinerary({
        userId: user.id,
        title,
        destinationId,
        destinationName,
        startDate,
        endDate,
        numberOfDays,
        notes,
        activities: activities.map((a, idx) => ({
          ...a,
          id: `act_${Date.now()}_${idx}`,
        })),
      });

      if (res.success) {
        navigate('/dashboard/itineraries');
      } else {
        setError(res.message || 'Failed to create itinerary');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving itinerary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-ivory-100">
        <button
          onClick={() => navigate('/dashboard/itineraries')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Itineraries</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-100 shadow-sm space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-emerald-600 block">
            Itinerary Planner
          </span>
          <h1 className="font-serif text-3xl font-bold text-navy-900 mt-1">
            Create Custom Travel Itinerary
          </h1>
          <p className="text-xs text-muted">
            Plan activities, dates, and attraction excursions. Publishes ItineraryCreated event to EventBus.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                Itinerary Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                Target Destination
              </label>
              <select
                value={destinationId}
                onChange={handleDestinationChange}
                className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 font-medium"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                Total Days
              </label>
              <input
                type="number"
                min={1}
                max={30}
                required
                value={numberOfDays}
                onChange={(e) => setNumberOfDays(Number(e.target.value))}
                className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
              General Itinerary Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Packing tips, train departure reminders, or ticket reservations..."
              className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            ></textarea>
          </div>

          {/* Activity Builder */}
          <div className="space-y-4 pt-4 border-t border-ivory-100">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-navy-900">Planned Activities</h3>
              <button
                type="button"
                onClick={handleAddActivity}
                className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Activity</span>
              </button>
            </div>

            <div className="space-y-3">
              {activities.map((act, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-ivory-50/70 border border-ivory-100 rounded-2xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-900">Activity #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveActivity(idx)}
                      className="text-muted hover:text-red-600 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-muted uppercase">Day #</label>
                      <input
                        type="number"
                        min={1}
                        max={numberOfDays}
                        value={act.dayNumber}
                        onChange={(e) => handleActivityChange(idx, 'dayNumber', Number(e.target.value))}
                        className="w-full bg-white border border-ivory-100 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-gold-500"
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <label className="block text-[10px] font-semibold text-muted uppercase">Activity Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Visit Tea Museum"
                        value={act.activityTitle}
                        onChange={(e) => handleActivityChange(idx, 'activityTitle', e.target.value)}
                        className="w-full bg-white border border-ivory-100 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-gold-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-muted uppercase">Time Slot</label>
                      <input
                        type="text"
                        placeholder="10:00 AM"
                        value={act.timeSlot}
                        onChange={(e) => handleActivityChange(idx, 'timeSlot', e.target.value)}
                        className="w-full bg-white border border-ivory-100 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-gold-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-muted uppercase">Duration (mins)</label>
                      <input
                        type="number"
                        step={15}
                        value={act.durationMinutes}
                        onChange={(e) => handleActivityChange(idx, 'durationMinutes', Number(e.target.value))}
                        className="w-full bg-white border border-ivory-100 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Optional details or description..."
                      value={act.description || ''}
                      onChange={(e) => handleActivityChange(idx, 'description', e.target.value)}
                      className="w-full bg-white border border-ivory-100 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Saving Itinerary...' : 'Save Itinerary & Notify'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
