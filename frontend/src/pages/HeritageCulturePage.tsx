import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Landmark, MapPin, Search, ArrowRight, ShieldCheck, Bookmark } from 'lucide-react';
import { api } from '../services/api';
import { HeritageSite } from '../types';

export const HeritageCulturePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get('category') || 'ALL';
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'ALL',
    'UNESCO World Heritage Sites',
    'Ancient Temples',
    'Forts and Palaces',
    'Historical Monuments',
  ];

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (activeCategory !== 'ALL') params.category = activeCategory;
    if (searchTerm) params.search = searchTerm;

    api.getHeritageSites(params)
      .then((res) => {
        if (res.success && res.sites) {
          setSites(res.sites);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [activeCategory, searchTerm]);

  const handleCategorySelect = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'ALL') next.delete('category');
    else next.set('category', cat);
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-semibold text-gold-600">
          Cultural Heritage & Architecture
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy-900">
          India’s Living Architectural Treasures
        </h1>
        <p className="text-sm text-muted">
          Explore UNESCO World Heritage monuments, ancient monolithic shrines, and royal forts preserved for future generations.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-ivory-100 p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search heritage monuments by name or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full md:w-auto">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    active
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
      </div>

      {/* Heritage Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-ivory-100 p-4"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sites.map((site) => (
            <div
              key={site.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-ivory-100 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={site.coverPhotograph}
                  alt={site.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur-sm text-gold-400 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {site.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted font-medium mb-1">
                    <MapPin className="w-3.5 h-3.5 text-gold-500" />
                    <span>{site.location}</span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-navy-900 group-hover:text-emerald-700 transition-colors">
                    {site.name}
                  </h3>
                  <p className="text-xs text-muted mt-2 line-clamp-3 leading-relaxed">
                    {site.historicalBackground}
                  </p>
                </div>

                <div className="pt-4 border-t border-ivory-100 flex items-center justify-between text-xs">
                  <span className="text-muted font-medium truncate max-w-[150px]">
                    Rail: {site.nearestStationCode}
                  </span>
                  <Link
                    to={`/heritage/${site.id}`}
                    className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>View Heritage</span>
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
