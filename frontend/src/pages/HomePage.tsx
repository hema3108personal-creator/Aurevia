import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Train,
  Landmark,
  Leaf,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TreePine,
  SunMedium,
  Building2,
  Waves,
  Mountain,
} from 'lucide-react';
import { TrainSearchWidget } from '../components/TrainSearchWidget';
import { api } from '../services/api';
import { Destination } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDestinations().then((res) => {
      if (res.success && res.destinations) {
        setDestinations(res.destinations);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const experiences = [
    { title: 'Nature and Adventure', category: 'Nature', count: '14+ Trails', icon: Mountain, image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80' },
    { title: 'Heritage and History', category: 'Historical', count: '28+ Forts & Sites', icon: Building2, image: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59f4?auto=format&fit=crop&w=600&q=80' },
    { title: 'Cultural Experiences', category: 'Cultural', count: '19+ Living Traditions', icon: Landmark, image: 'https://images.unsplash.com/photo-1600100397608-f010f4439c2c?auto=format&fit=crop&w=600&q=80' },
    { title: 'Wildlife & Sanctuaries', category: 'Wildlife', count: '12+ Reserves', icon: TreePine, image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80' },
    { title: 'Beaches & Coastal', category: 'Beach', count: '15+ Coastal Havens', icon: Waves, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80' },
    { title: 'Spiritual Journeys', category: 'Cultural', count: '10+ Timeless Cities', icon: SunMedium, image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-navy-950 text-white overflow-hidden pt-12 pb-24">
        {/* Cinematic Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85"
            alt="Scenic Nilgiri Mountain Railway Train"
            className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold tracking-wider uppercase animate-in fade-in duration-700">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Smart Tourism & Sustainable Railway Network</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            The World, <span className="italic font-normal text-gold-400">Seamlessly</span> Connected.
          </h1>

          <p className="text-base sm:text-xl text-ivory-100/80 max-w-2xl mx-auto font-light leading-relaxed">
            Discover extraordinary destinations, experience cultural heritage, and plan smarter journeys with one connected event-driven travel platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/destinations')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-8 py-3.5 rounded-xl shadow-lg hover:shadow-emerald-900/40 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Destinations</span>
            </button>
            <button
              onClick={() => navigate('/trains')}
              className="bg-navy-800/80 hover:bg-navy-800 text-white font-medium px-8 py-3.5 rounded-xl border border-ivory-100/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Train className="w-4 h-4 text-gold-400" />
              <span>Find a Train</span>
            </button>
          </div>

          {/* Integrated Railway Search Panel */}
          <div className="pt-8 max-w-5xl mx-auto text-left">
            <TrainSearchWidget />
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-emerald-600 block mb-2">
              Curated Destinations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900">
              Journeys Crafted for the Discerning Traveler
            </h2>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors mt-4 md:mt-0 group"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.slice(0, 8).map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-ivory-100 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
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
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-muted font-medium mb-1">{dest.state}, India</div>
                  <h3 className="font-serif font-bold text-xl text-navy-900 group-hover:text-emerald-700 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-ivory-100 flex items-center justify-between">
                  <span className="text-xs text-navy-800 font-medium">
                    {dest.estimatedVisitDurationDays} Days Recommended
                  </span>
                  <Link
                    to={`/destinations/${dest.id}`}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Discover Experiences Section */}
      <section className="bg-navy-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-400">
              Thematic Exploration
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Discover by Travel Experience
            </h2>
            <p className="text-sm text-ivory-100/70 font-light">
              Filter destinations and simulated rail lines tailored to your exact journey style.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((exp) => {
              const Icon = exp.icon;
              return (
                <div
                  key={exp.title}
                  onClick={() => navigate(`/destinations?category=${exp.category}`)}
                  className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md"
                >
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent"></div>
                  <div className="absolute bottom-5 left-5 right-5 space-y-1">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/90 flex items-center justify-center text-white mb-2">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-white group-hover:text-gold-400 transition-colors">
                      {exp.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-ivory-100/70">
                      <span>{exp.count}</span>
                      <span className="font-semibold text-gold-400 group-hover:underline">Explore Category →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cultural Heritage Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-600">
              Living Legacy & Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-navy-900 leading-tight">
              Preserving India’s Cultural Heritage Through Rail
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              From the intricately sculpted rock-cut temples of Mahabalipuram to the grand royal courtyards of Jaipur and Hampi, experience timeless historical architecture connected directly by Indian Railways.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <strong className="text-navy-900 font-medium">UNESCO World Heritage Circuits:</strong> Direct route planning to India’s most revered monuments.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <strong className="text-navy-900 font-medium">Curated Visiting Information:</strong> Accurate timings, conservation rules, and ticket guidelines.
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Link
                to="/heritage"
                className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-6 py-3 rounded-xl text-sm font-medium shadow-md transition-all"
              >
                <span>Explore Cultural Heritage</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
              alt="Taj Mahal"
              className="rounded-2xl shadow-md h-72 w-full object-cover transform translate-y-4"
            />
            <img
              src="https://images.unsplash.com/photo-1600100397608-f010f4439c2c?auto=format&fit=crop&w=800&q=80"
              alt="Hampi Stone Chariot"
              className="rounded-2xl shadow-md h-72 w-full object-cover transform -translate-y-4"
            />
          </div>
        </div>
      </section>

      {/* Sustainable Travel Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-navy-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold">
              <Leaf className="w-3.5 h-3.5" />
              <span>Eco-Responsible Tourism</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Travel Better. Leave a Lighter Footprint.
            </h2>
            <p className="text-sm text-ivory-100/80 leading-relaxed font-light">
              Railway travel produces up to 75% fewer carbon emissions per passenger-kilometer compared to private road transit or short-haul flights. Discover how your route choices support fragile mountain ecosystems and local heritage communities.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/sustainable-travel"
                className="bg-white text-emerald-900 hover:bg-ivory-50 px-6 py-3 rounded-xl font-medium text-sm shadow-md transition-all"
              >
                Learn About Sustainable Rail Travel
              </Link>
              <Link
                to="/dashboard/recommendations"
                className="bg-emerald-700/60 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium text-sm border border-emerald-500/30 transition-all"
              >
                Get Personalized Recommendations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
