import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Trash2, ArrowRight, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Destination } from '../types';

export const SavedDestinationsPage: React.FC = () => {
  const { user } = useAuth();
  const [savedRecords, setSavedRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = () => {
    if (!user) return;
    setLoading(true);
    api.getSavedDestinations(user.id)
      .then((res) => {
        if (res.success && res.saved) {
          setSavedRecords(res.saved);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSaved();
  }, [user]);

  const handleRemove = async (destId: string) => {
    if (!user) return;
    try {
      await api.removeSavedDestination(user.id, destId);
      fetchSaved();
    } catch (err: any) {
      alert('Failed to remove saved destination');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-ivory-100">
        <h1 className="font-serif text-3xl font-bold text-navy-900">Saved Destinations</h1>
        <p className="text-xs text-muted mt-1">
          Your bookmarked places and travel aspirations stored in Tourism Service.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-ivory-100 p-4"></div>
          ))}
        </div>
      ) : savedRecords.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 border border-ivory-100">
          <Bookmark className="w-12 h-12 text-muted mx-auto" />
          <h3 className="font-serif text-lg font-bold text-navy-900">No Saved Destinations</h3>
          <p className="text-xs text-muted leading-relaxed">
            Explore our curated destinations across India and bookmark your favorites for quick itinerary planning.
          </p>
          <Link
            to="/destinations"
            className="inline-block bg-navy-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl"
          >
            Explore Destinations
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedRecords.map((item) => {
            const dest: Destination = item.destination;
            if (!dest) return null;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-ivory-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="h-44 relative overflow-hidden">
                  <img src={dest.coverImage} alt={dest.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-navy-900/80 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase">
                    {dest.category}
                  </span>
                  <button
                    onClick={() => handleRemove(dest.id)}
                    className="absolute top-3 right-3 p-1.5 bg-white/90 text-red-600 rounded-full hover:bg-white transition-colors shadow-sm"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-muted flex items-center gap-1 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-gold-500" />
                      <span>{dest.state}, India</span>
                    </div>
                    <h4 className="font-serif font-bold text-lg text-navy-900">{dest.name}</h4>
                    <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-ivory-100 flex items-center justify-between text-xs">
                    <span className="text-muted font-medium">{dest.estimatedVisitDurationDays} Days Ideal</span>
                    <Link
                      to={`/destinations/${dest.id}`}
                      className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
