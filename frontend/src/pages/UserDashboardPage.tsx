import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  Bookmark,
  Sparkles,
  Train,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Bell,
  Compass,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Booking, Itinerary, Notification, Recommendation, Destination } from '../types';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    Promise.all([
      api.getUserBookings(user.id),
      api.getItineraries(user.id),
      api.getSavedDestinations(user.id),
      api.getRecommendations(user.id),
      api.getNotifications(user.id),
    ])
      .then(([bRes, iRes, sRes, rRes, nRes]) => {
        if (bRes?.success) setBookings(bRes.bookings || []);
        if (iRes?.success) setItineraries(iRes.itineraries || []);
        if (sRes?.success) setSavedCount(sRes.saved?.length || 0);
        if (rRes?.success) setRecommendations(rRes.recommendations || []);
        if (nRes?.success) setNotifications(nRes.notifications || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const upcomingBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const nextJourney = upcomingBookings[0] || null;

  const activityChartData = [
    { month: 'Jun', km: 240 },
    { month: 'Jul', km: 450 },
    { month: 'Aug', km: 380 },
    { month: 'Sep', km: 695 },
    { month: 'Oct', km: 820 },
    { month: 'Nov', km: nextJourney ? 695 : 300 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
            Traveler Dashboard
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}
          </h1>
          <p className="text-xs sm:text-sm text-ivory-100/75 leading-relaxed font-light">
            Your journeys, smart itineraries, and simulated railway reservations are synchronized in real-time across the AUREVIA microservices cluster.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-3">
            <Link
              to="/trains"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Train className="w-3.5 h-3.5" />
              <span>Book a Train</span>
            </Link>
            <Link
              to="/destinations"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl backdrop-blur-sm transition-all flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-gold-400" />
              <span>Explore Destinations</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-ivory-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Total Bookings</span>
            <span className="text-2xl font-serif font-bold text-navy-900">{bookings.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center">
            <Train className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Upcoming Journeys</span>
            <span className="text-2xl font-serif font-bold text-navy-900">{upcomingBookings.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Saved Places</span>
            <span className="text-2xl font-serif font-bold text-navy-900">{savedCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Itineraries</span>
            <span className="text-2xl font-serif font-bold text-navy-900">{itineraries.length}</span>
          </div>
        </div>
      </div>

      {/* Upcoming Journey Card */}
      {nextJourney && (
        <div className="bg-white rounded-2xl p-6 border border-ivory-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Next Upcoming Journey
              </span>
            </div>
            <span className="text-xs font-bold text-navy-900 font-mono">
              PNR: {nextJourney.pnr}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 space-y-1">
              <h3 className="font-serif font-bold text-xl text-navy-900">
                {nextJourney.trainNumber} {nextJourney.trainName}
              </h3>
              <div className="text-xs text-muted flex items-center gap-3">
                <span>Class: <strong>{nextJourney.travelClass}</strong></span>
                <span>•</span>
                <span>Passengers: <strong>{nextJourney.passengers.length}</strong></span>
              </div>
            </div>

            <div className="md:col-span-4 flex items-center gap-4 text-xs font-medium text-navy-800">
              <div>
                <div className="font-bold text-base text-navy-900">{nextJourney.departureTime}</div>
                <div>{nextJourney.sourceStationName}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <div className="font-bold text-base text-navy-900">{nextJourney.arrivalTime}</div>
                <div>{nextJourney.destinationStationName}</div>
              </div>
            </div>

            <div className="md:col-span-3 text-left md:text-right">
              <Link
                to={`/dashboard/bookings/${nextJourney.id}`}
                className="inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-medium px-4 py-2 rounded-xl transition-all"
              >
                <span>View Ticket Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Travel Activity Chart & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recharts Activity Area Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-ivory-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-navy-900">Eco-Rail Travel Activity</h3>
            <span className="text-xs text-emerald-600 font-semibold">Kilometers Travelled by Rail</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityChartData}>
                <defs>
                  <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#27856B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#27856B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#87919D" fontSize={11} />
                <YAxis stroke="#87919D" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="km" stroke="#27856B" strokeWidth={2} fillOpacity={1} fill="url(#colorKm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Notifications Feed */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-ivory-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-100">
            <h3 className="font-serif font-bold text-base text-navy-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-gold-500" />
              Recent Event Notifications
            </h3>
            <Link to="/dashboard/notifications" className="text-xs text-emerald-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {notifications.length > 0 ? (
              notifications.slice(0, 4).map((n) => (
                <div key={n.id} className="p-3 bg-ivory-50/70 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-navy-900 flex items-center justify-between">
                    <span>{n.title}</span>
                    <span className="text-[10px] text-muted font-normal">
                      {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-muted leading-relaxed line-clamp-2">{n.message}</p>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted text-center py-8">No notifications received yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Destinations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-xl text-navy-900">Recommended for You</h3>
            <p className="text-xs text-muted">Rule-based recommendations based on your preferences</p>
          </div>
          <Link
            to="/dashboard/recommendations"
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            Adjust Preferences →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.slice(0, 3).map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl border border-ivory-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="h-40 relative overflow-hidden">
                <img src={rec.destinationImage} alt={rec.destinationName} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 bg-navy-900 text-gold-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {rec.matchScore}% Match
                </span>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-lg text-navy-900">{rec.destinationName}</h4>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{rec.reason}</p>
                </div>
                <div className="pt-3 border-t border-ivory-100 flex items-center justify-between">
                  <span className="text-xs text-navy-700 font-medium">{rec.state}</span>
                  <Link
                    to={`/destinations/${rec.destinationId}`}
                    className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
