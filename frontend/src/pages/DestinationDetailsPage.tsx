import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Leaf,
  Train,
  Bookmark,
  Share2,
  CheckCircle2,
  ArrowRight,
  Clock,
  Coins,
  Compass,
} from 'lucide-react';
import { api } from '../services/api';
import { Destination } from '../types';
import { useAuth } from '../context/AuthContext';
import { LeafletMap } from '../components/LeafletMap';

export const DestinationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getDestination(id)
      .then((res) => {
        if (res.success && res.destination) {
          setDestination(res.destination);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    if (isAuthenticated && user && id) {
      api.getSavedDestinations(user.id).then((res) => {
        if (res.success && res.saved) {
          const isSaved = res.saved.some((s: any) => s.destinationId === id);
          setSaved(isSaved);
        }
      }).catch(() => {});
    }
  }, [id, isAuthenticated, user]);

  const handleToggleSave = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    if (!destination) return;

    try {
      if (saved) {
        await api.removeSavedDestination(user.id, destination.id);
        setSaved(false);
        setSaveMessage('Removed from your saved destinations');
      } else {
        await api.saveDestination(user.id, destination.id);
        setSaved(true);
        setSaveMessage('Saved to your dashboard places!');
      }
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage('Failed to update saved place');
    }
  };

  const handlePlanItinerary = () => {
    if (!destination) return;
    navigate(`/dashboard/itineraries/create?destId=${destination.id}&destName=${encodeURIComponent(destination.name)}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted font-medium">
        Loading destination narrative and attractions...
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Compass className="w-12 h-12 text-muted mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-navy-900">Destination Not Found</h2>
        <Link to="/destinations" className="inline-block bg-navy-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium">
          Browse All Destinations
        </Link>
      </div>
    );
  }

  const mapMarkers = [
    {
      id: destination.id,
      name: destination.name,
      latitude: destination.latitude,
      longitude: destination.longitude,
      category: destination.category,
      description: destination.description,
    },
    ...(destination.popularAttractions || []).map((s) => ({
      id: s.id,
      name: s.name,
      latitude: s.latitude,
      longitude: s.longitude,
      category: s.category,
      description: s.description,
    })),
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Header Banner */}
      <div className="relative h-[65vh] min-h-[450px] w-full overflow-hidden bg-navy-950">
        <img
          src={destination.coverImage}
          alt={destination.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent"></div>

        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {destination.category}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sustainability Score: {destination.ecoFriendlyScore}/100</span>
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white tracking-tight">
            {destination.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-ivory-100/90 font-light">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gold-400" />
              {destination.state}, India
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold-400" />
              Best Season: {destination.bestTimeToVisit}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gold-400" />
              {destination.estimatedVisitDurationDays} Days Ideal Duration
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Narrative, Attractions, Map */}
          <div className="lg:col-span-8 space-y-10">
            {/* Notification alert */}
            {saveMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveMessage}</span>
              </div>
            )}

            {/* Overview Narrative */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-ivory-100 space-y-4">
              <h2 className="font-serif text-2xl font-bold text-navy-900">About the Destination</h2>
              <p className="text-sm md:text-base text-navy-800/80 leading-relaxed">
                {destination.description}
              </p>

              <div className="pt-4 border-t border-ivory-100">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Key Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {destination.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-sm text-navy-900 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular Attractions */}
            {destination.popularAttractions && destination.popularAttractions.length > 0 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest font-semibold text-emerald-600 block">
                    Sightseeing & Excursions
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-navy-900 mt-1">
                    Notable Attractions & Points of Interest
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {destination.popularAttractions.map((spot) => (
                    <div
                      key={spot.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-ivory-100 flex flex-col"
                    >
                      <div className="h-44 overflow-hidden relative">
                        <img
                          src={spot.imageUrl}
                          alt={spot.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-navy-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">
                          {spot.category}
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="font-serif font-bold text-lg text-navy-900">{spot.name}</h4>
                          <p className="text-xs text-muted mt-1 leading-relaxed">{spot.description}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-3 border-t border-ivory-100 text-muted">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-navy-700" />
                            {spot.estimatedDurationHours} Hours Visit
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-emerald-700">
                            <Coins className="w-3.5 h-3.5" />
                            {spot.entryFee === 0 ? 'Free Entry' : `₹${spot.entryFee}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Leaflet Map */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-ivory-100 space-y-4">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block">
                  Geographic Coordinates & Points
                </span>
                <h3 className="font-serif text-xl font-bold text-navy-900 mt-0.5">
                  Interactive Location Map
                </h3>
              </div>
              <LeafletMap
                center={[destination.latitude, destination.longitude]}
                zoom={11}
                markers={mapMarkers}
                height="420px"
              />
            </div>
          </div>

          {/* Right Column: Railway Connectivity & Action Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-ivory-100 space-y-4 sticky top-28">
              <h3 className="font-serif font-bold text-xl text-navy-900">Plan This Journey</h3>

              <div className="space-y-3">
                <button
                  onClick={handlePlanItinerary}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Build Custom Itinerary</span>
                </button>

                <button
                  onClick={handleToggleSave}
                  className={`w-full py-3 rounded-xl font-medium border text-sm transition-all flex items-center justify-center gap-2 ${
                    saved
                      ? 'bg-gold-50 border-gold-300 text-gold-700'
                      : 'border-ivory-100 hover:bg-ivory-50 text-navy-800'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                  <span>{saved ? 'Saved to Your Places' : 'Save to Favorites'}</span>
                </button>
              </div>

              {/* Nearest Railway Hub */}
              <div className="pt-4 border-t border-ivory-100 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted block flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5 text-emerald-600" />
                  Direct Railway Gateway
                </span>
                <div className="bg-ivory-50 p-3.5 rounded-xl border border-ivory-100">
                  <div className="font-bold text-navy-900 text-sm">{destination.nearestStationName}</div>
                  <div className="text-xs text-muted">Station Code: {destination.nearestStationCode}</div>
                  <Link
                    to={`/trains/search?to=${destination.nearestStationCode}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 mt-2"
                  >
                    <span>Check Train Schedules</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Sustainable Tips */}
              <div className="pt-4 border-t border-ivory-100 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 block flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5" />
                  Sustainable Travel Guidelines
                </span>
                <ul className="space-y-2 text-xs text-navy-800/80">
                  {destination.sustainableTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
