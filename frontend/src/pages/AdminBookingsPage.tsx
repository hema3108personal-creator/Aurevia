import React, { useState, useEffect } from 'react';
import { Ticket, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';
import { api } from '../services/api';
import { Booking } from '../types';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');

  useEffect(() => {
    setLoading(true);
    api.getAdminBookings()
      .then((res) => {
        if (res.success && res.bookings) {
          setBookings(res.bookings);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.pnr.toLowerCase().includes(search.toLowerCase()) ||
      b.userName?.toLowerCase().includes(search.toLowerCase()) ||
      b.trainNumber.includes(search) ||
      b.trainName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-100">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">All Reservations</h1>
          <p className="text-xs text-muted mt-1">
            Global ticket database across all registered travelers in Reservation Service.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter by PNR, user, or train..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-ivory-100 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white border border-ivory-100 rounded-xl px-3 py-2 text-xs font-medium text-navy-900"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed Only</option>
            <option value="CANCELLED">Cancelled Only</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-ivory-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted">Loading bookings...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-50 text-muted uppercase font-semibold border-b border-ivory-100">
                <tr>
                  <th className="py-3.5 px-4">PNR</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Train Service</th>
                  <th className="py-3.5 px-4">Journey Route</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Fare</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-ivory-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy-900">{b.pnr}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-navy-900">{b.userName}</div>
                      <div className="text-[10px] text-muted">{b.userEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-navy-900">
                      {b.trainNumber} {b.trainName} ({b.travelClass})
                    </td>
                    <td className="py-3.5 px-4 text-navy-800">
                      {b.sourceStationCode} → {b.destinationStationCode}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-muted">{b.journeyDate}</td>
                    <td className="py-3.5 px-4 font-serif font-bold text-emerald-700">₹{b.totalFare}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {b.status === 'CONFIRMED' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{b.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
