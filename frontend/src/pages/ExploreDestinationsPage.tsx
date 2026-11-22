import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Leaf, MapPin, ArrowRight, Compass } from 'lucide-react';
import { api } from '../services/api';
import { Destination } from '../types';

export const ExploreDestinationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get('category') || 'ALL';
  const activeState = searchParams.get('state') || 'ALL';
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['ALL', 'Nature', 'Historical', 'Cultural', 'Adventure', 'Wildlife', 'Beach'];
  const states = ['ALL', 'Kerala', 'Tamil Nadu', 'Rajasthan', 'Uttar Pradesh', 'Karnataka', 'Goa', 'Himachal Pradesh'];

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (activeCategory !== 'ALL') params.category = activeCategory;
    if (activeState !== 'ALL') params.state = activeState;
    if (searchTerm) params.search = searchTerm;

    api.getDestinations(params)
      .then((res) => {
        if (res.success && res.destinations) {
          setDestinations(res.destinations);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory, activeState, searchTerm]);

  const handleCategorySelect = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'ALL') next.delete('category');
    else next.set('category', cat);
    setSearchParams(next);
  };

  const handleStateSelect = (st: string) => {
    const next = new URLSearchParams(searchParams);
    if (st === 'ALL') next.delete('state');
    else next.set('state', st);
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-semibold text-emerald-600">
          Smart Tourism Discovery
        </span>
        <h1 className="font-serif text-4xl font-bold text-navy-900">
          Extraordinary Destinations Across India
        </h1>
        <p className="text-sm text-muted">
          Explore hill stations, coastal sanctuaries, and royal capitals connected directly via scenic railway routes.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-ivory-100 p-6 space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by destination, state, or attraction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          {/* State Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted whitespace-nowrap">
              Filter State:
            </label>
            <select
              value={activeState}
              onChange={(e) => handleStateSelect(e.target.value)}
              className="bg-ivory-50/80 border border-ivory-100 rounded-xl px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-ivory-100/70 text-navy-800 hover:bg-ivory-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Destination Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-ivory-100 p-4"></div>
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto space-y-3 border border-ivory-100">
          <Compass className="w-10 h-10 text-muted mx-auto" />
          <h3 className="font-serif text-lg font-bold text-navy-900">No Destinations Found</h3>
          <p className="text-xs text-muted">Try adjusting your category, state filter or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-ivory-100 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={dest.coverImage}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {dest.category}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Leaf className="w-3 h-3" />
                  <span>{dest.ecoFriendlyScore} Eco</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted font-medium mb-1">
                    <MapPin className="w-3 h-3 text-gold-500" />
                    <span>{dest.state}, India</span>
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-navy-900 group-hover:text-emerald-700 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-muted mt-2 line-clamp-3 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {dest.highlights.slice(0, 3).map((h) => (
                      <span key={h} className="text-[10px] bg-ivory-100 text-navy-800 px-2 py-0.5 rounded-md font-medium">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-ivory-100 flex items-center justify-between">
                  <span className="text-xs text-navy-800 font-medium">
                    {dest.estimatedVisitDurationDays} Days • Best: {dest.bestTimeToVisit.split(' ')[0]}
                  </span>
                  <Link
                    to={`/destinations/${dest.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>Explore Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
