import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Coins,
  Train,
  Bookmark,
  CheckCircle2,
  Calendar,
  Landmark,
  Compass,
} from 'lucide-react';
import { api } from '../services/api';
import { HeritageSite } from '../types';
import { useAuth } from '../context/AuthContext';
import { LeafletMap } from '../components/LeafletMap';

export const HeritageDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [site, setSite] = useState<HeritageSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getHeritageSite(id)
      .then((res) => {
        if (res.success && res.site) {
          setSite(res.site);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    if (isAuthenticated && user && id) {
      api.getSavedHeritage(user.id).then((res) => {
        if (res.success && res.saved) {
          const isSaved = res.saved.some((s: any) => s.heritageId === id);
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
    if (!site) return;

    try {
      if (saved) {
        await api.removeSavedHeritage(user.id, site.id);
        setSaved(false);
        setSaveMessage('Removed from your saved heritage sites');
      } else {
        await api.saveHeritage(user.id, site.id);
        setSaved(true);
        setSaveMessage('Saved to your cultural heritage collection!');
      }
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage('Failed to update saved heritage');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted font-medium">
        Loading heritage narrative and historical details...
      </div>
    );
  }

  if (!site) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Landmark className="w-12 h-12 text-muted mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-navy-900">Heritage Site Not Found</h2>
        <Link to="/heritage" className="inline-block bg-navy-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium">
          Explore Heritage Sites
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Header */}
      <div className="relative h-[65vh] min-h-[450px] w-full overflow-hidden bg-navy-950">
        <img
          src={site.coverPhotograph}
          alt={site.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent"></div>

        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white space-y-4">
          <span className="bg-gold-500 text-navy-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {site.category}
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white tracking-tight">
            {site.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-ivory-100/90 font-light">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gold-400" />
              {site.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold-400" />
              Recommended: {site.visitingInformation?.bestSeason || 'Winter months'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8">
            {saveMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveMessage}</span>
              </div>
            )}

            {/* Historical Background */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-ivory-100 space-y-3">
              <h2 className="font-serif text-2xl font-bold text-navy-900">Historical Background</h2>
              <p className="text-sm md:text-base text-navy-800/80 leading-relaxed">
                {site.historicalBackground}
              </p>
            </div>

            {/* Cultural Significance */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-ivory-100 space-y-3">
              <h2 className="font-serif text-2xl font-bold text-navy-900">Cultural Significance</h2>
              <p className="text-sm md:text-base text-navy-800/80 leading-relaxed">
                {site.culturalSignificance}
              </p>
            </div>

            {/* Architectural Details */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-ivory-100 space-y-3">
              <h2 className="font-serif text-2xl font-bold text-navy-900">Architectural Masterpiece</h2>
              <p className="text-sm md:text-base text-navy-800/80 leading-relaxed">
                {site.architecturalDetails}
              </p>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-ivory-100 space-y-3">
              <h3 className="font-serif text-xl font-bold text-navy-900">Site Location Map</h3>
              <LeafletMap
                center={[site.latitude, site.longitude]}
                zoom={12}
                markers={[
                  {
                    id: site.id,
                    name: site.name,
                    latitude: site.latitude,
                    longitude: site.longitude,
                    category: site.category,
                    description: site.location,
                  },
                ]}
                height="380px"
              />
            </div>
          </div>

          {/* Sidebar: Visiting Details & Actions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-ivory-100 space-y-6 sticky top-28">
              <button
                onClick={handleToggleSave}
                className={`w-full py-3 rounded-xl font-medium border text-sm transition-all flex items-center justify-center gap-2 ${
                  saved
                    ? 'bg-gold-50 border-gold-300 text-gold-700'
                    : 'border-ivory-100 hover:bg-ivory-50 text-navy-800'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                <span>{saved ? 'Saved in Heritage Collection' : 'Save Heritage Site'}</span>
              </button>

              {/* Visiting Timings and Tickets */}
              <div className="space-y-4 pt-2">
                <h4 className="font-serif font-bold text-base text-navy-900">Visiting Information</h4>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-ivory-50 rounded-xl border border-ivory-100">
                    <span className="text-muted block flex items-center gap-1 font-semibold uppercase tracking-wider mb-1">
                      <Clock className="w-3.5 h-3.5 text-navy-700" />
                      Opening Hours
                    </span>
                    <span className="font-semibold text-navy-900">{site.visitingInformation?.timings}</span>
                  </div>

                  <div className="p-3 bg-ivory-50 rounded-xl border border-ivory-100">
                    <span className="text-muted block flex items-center gap-1 font-semibold uppercase tracking-wider mb-1">
                      <Coins className="w-3.5 h-3.5 text-navy-700" />
                      Entry Tariff
                    </span>
                    <span className="font-semibold text-navy-900">{site.visitingInformation?.entryFee}</span>
                  </div>
                </div>

                {/* Guidelines */}
                {site.visitingInformation?.guidelines && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
                      Visitor Guidelines
                    </span>
                    <ul className="space-y-1.5 text-xs text-navy-800/80">
                      {site.visitingInformation.guidelines.map((g, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-gold-500 font-bold">•</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Railway Connectivity */}
              <div className="pt-4 border-t border-ivory-100 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted block flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5 text-emerald-600" />
                  Nearest Railway Connection
                </span>
                <div className="font-bold text-sm text-navy-900">{site.nearestStationName}</div>
                <div className="text-xs text-muted">Station Code: {site.nearestStationCode}</div>
                <Link
                  to={`/trains/search?to=${site.nearestStationCode}`}
                  className="block text-center mt-3 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold py-2.5 rounded-xl shadow-sm transition-all"
                >
                  Book Train to {site.nearestStationCode}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
