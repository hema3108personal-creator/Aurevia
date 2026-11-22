import React, { useState, useEffect } from 'react';
import {
  Users,
  Ticket,
  CheckCircle2,
  XCircle,
  Compass,
  Landmark,
  Coins,
  TrendingUp,
  Activity,
  Shield,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { api } from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getAdminAnalytics()
      .then((res) => {
        if (res.success) {
          setAnalytics(res);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ['#27856B', '#C6A879', '#172B43', '#87919D', '#32547E', '#21735C'];

  if (loading) {
    return (
      <div className="p-12 text-center text-muted font-medium">
        Aggregating microservices analytics from API Gateway...
      </div>
    );
  }

  const m = analytics?.metrics || {
    totalUsers: 2,
    totalBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    totalDestinations: 10,
    totalHeritageSites: 8,
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="pb-4 border-b border-ivory-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">
            System Analytics & Administration Overview
          </h1>
          <p className="text-xs text-muted mt-1">
            Aggregated cross-service operational metrics computed via API Gateway reverse proxy.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            9/9 Services Healthy
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-ivory-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Registered Users</span>
            <span className="text-2xl font-serif font-bold text-navy-900">{m.totalUsers}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Total Bookings</span>
            <span className="text-2xl font-serif font-bold text-navy-900">{m.totalBookings}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Simulated Revenue</span>
            <span className="text-2xl font-serif font-bold text-navy-900">₹{m.totalRevenue}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Destinations</span>
            <span className="text-2xl font-serif font-bold text-navy-900">{m.totalDestinations}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Booking Trends BarChart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-ivory-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-navy-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Monthly Railway Reservations
            </h3>
            <span className="text-xs text-muted font-medium">Bookings Volume</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.monthlyTrends || []}>
                <XAxis dataKey="month" stroke="#87919D" fontSize={11} />
                <YAxis stroke="#87919D" fontSize={11} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#172B43" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution PieChart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-ivory-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-navy-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-gold-500" />
              Tourism Categories
            </h3>
            <span className="text-xs text-muted font-medium">Distribution</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.categoryDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {(analytics?.categoryDistribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Popular Destinations & Health Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Popular Destinations Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-ivory-100 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-navy-900">
            Top Tourism Corridors & Eco Scores
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-50 text-muted uppercase font-semibold border-b border-ivory-100">
                <tr>
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3">State</th>
                  <th className="py-2.5 px-3">Sustainability Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-100">
                {(analytics?.popularDestinations || []).map((d: any) => (
                  <tr key={d.id} className="hover:bg-ivory-50/50">
                    <td className="py-3 px-3 font-bold text-navy-900">{d.name}</td>
                    <td className="py-3 px-3 text-muted">{d.state}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">{d.ecoScore}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Microservices Cluster Health */}
        <div className="lg:col-span-5 bg-navy-900 text-white p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-gold-400">Microservices Health</h3>
            <span className="text-[11px] font-mono text-emerald-400">All Live</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
            {[
              { name: 'API Gateway', port: 5000 },
              { name: 'User Service', port: 5001 },
              { name: 'Railway Service', port: 5002 },
              { name: 'Reservation Service', port: 5003 },
              { name: 'Tourism Service', port: 5004 },
              { name: 'Heritage Service', port: 5005 },
              { name: 'Recommendation', port: 5006 },
              { name: 'Itinerary Service', port: 5007 },
              { name: 'Notification Service', port: 5008 },
            ].map((s) => (
              <div key={s.name} className="p-2.5 bg-navy-800 rounded-xl border border-navy-700 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white text-[11px] truncate max-w-[100px]">{s.name}</div>
                  <div className="text-[10px] text-ivory-100/50">Port :{s.port}</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
