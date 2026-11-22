import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, ArrowRight, RefreshCw, Calendar, MapPin, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Recommendation } from '../types';

export const RecommendationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Nature',
    'Cultural Experiences',
  ]);
  const [preferredState, setPreferredState] = useState<string>('Kerala');
  const [availableDays, setAvailableDays] = useState<number>(3);
  const [travelStyle, setTravelStyle] = useState<string>('Scenic');

  const availableCategories = [
    'Nature',
    'Adventure',
    'Historical',
    'Cultural Experiences',
    'Wildlife',
    'Beaches',
    'Architecture',
  ];

  const states = ['ALL', 'Kerala', 'Tamil Nadu', 'Rajasthan', 'Uttar Pradesh', 'Karnataka', 'Goa', 'Himachal Pradesh'];

  const fetchRecommendations = () => {
    if (!user) return;
    setLoading(true);
    api.generateRecommendations({
      userId: user.id,
      categories: selectedCategories,
      preferredState,
      availableDays,
      travelStyle,
    })
      .then((res) => {
        if (res.success && res.recommendations) {
          setRecommendations(res.recommendations);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Load initial user preferences if available
    api.getPreferences().then((res) => {
      if (res.success && res.preferences) {
        if (res.preferences.categories?.length) setSelectedCategories(res.preferences.categories);
        if (res.preferences.preferredState) setPreferredState(res.preferences.preferredState);
        if (res.preferences.availableDays) setAvailableDays(res.preferences.availableDays);
      }
    }).catch(() => {}).finally(() => {
      fetchRecommendations();
    });
  }, [user]);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleApplyPreferences = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecommendations();
    // Persist to user preference store
    api.updatePreferences({
      categories: selectedCategories,
      preferredState,
      availableDays,
      travelStyle,
    }).catch(() => {});
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-ivory-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Rule-Based Recommendation Engine
          </span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-navy-900 mt-1">
          Personalized Destination Recommendations
        </h1>
        <p className="text-xs text-muted mt-1">
          Scored transparently using category correlation, available schedule duration, and rail proximity.
        </p>
      </div>

      {/* Preferences Form Box */}
      <form
        onSubmit={handleApplyPreferences}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-100 shadow-sm space-y-6"
      >
        <h3 className="font-serif font-bold text-lg text-navy-900">Configure Your Travel Criteria</h3>

        {/* Categories Multi-Select */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
            Preferred Travel Interests (Select multiple)
          </label>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => {
              const active = selectedCategories.includes(cat);
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'bg-ivory-50 text-navy-800 border border-ivory-100 hover:bg-ivory-100'
                  }`}
                >
                  {active && <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
              Preferred State / Region
            </label>
            <select
              value={preferredState}
              onChange={(e) => setPreferredState(e.target.value)}
              className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-gold-500"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s === 'ALL' ? 'Any State' : s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
              Available Duration (Days)
            </label>
            <input
              type="number"
              min={1}
              max={14}
              value={availableDays}
              onChange={(e) => setAvailableDays(Number(e.target.value))}
              className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
              Travel Style
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-gold-500"
            >
              <option value="Scenic">Scenic & Relaxed</option>
              <option value="Fast-Paced">Fast-Paced Explorer</option>
              <option value="Eco-Conscious">Eco & Heritage Focused</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Computing Matches...' : 'Re-compute Recommendations'}</span>
        </button>
      </form>

      {/* Scored Recommendations Results Grid */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-xl text-navy-900">Ranked Matching Results</h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-56 animate-pulse border border-ivory-100 p-6"></div>
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-xs text-muted">
            No recommendations generated. Try selecting broader criteria above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-3xl border border-ivory-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={rec.destinationImage}
                    alt={rec.destinationName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-navy-900/85 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase">
                    {rec.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-gold-500 text-navy-950 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {rec.matchScore}% Match
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-xs text-muted flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold-500" />
                      <span>{rec.state}, India</span>
                    </div>
                    <h4 className="font-serif font-bold text-2xl text-navy-900">
                      {rec.destinationName}
                    </h4>

                    {/* Transparent Explanation Box */}
                    <div className="p-3 bg-ivory-50 rounded-xl border border-ivory-100 text-xs text-navy-800/80 leading-relaxed">
                      💡 <strong>Algorithm Explanation:</strong> {rec.reason}
                    </div>

                    {rec.attractions && rec.attractions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {rec.attractions.slice(0, 3).map((a) => (
                          <span key={a} className="text-[10px] bg-ivory-100 text-navy-800 px-2 py-0.5 rounded-md font-medium">
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-ivory-100 flex items-center justify-between">
                    <Link
                      to={`/destinations/${rec.destinationId}`}
                      className="text-xs font-bold text-navy-900 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <span>Explore Destination</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to={`/dashboard/itineraries/create?destId=${rec.destinationId}&destName=${encodeURIComponent(rec.destinationName)}`}
                      className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      + Add to Itinerary
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
