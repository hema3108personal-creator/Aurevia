import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Train,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Booking } from '../types';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = () => {
    if (!user) return;
    setLoading(true);
    api.getUserBookings(user.id)
      .then((res) => {
        if (res.success && res.bookings) {
          setBookings(res.bookings);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this railway reservation? This will publish a BookingCancelled event to RabbitMQ.')) {
      return;
    }
    setCancellingId(bookingId);
    try {
      const res = await api.cancelBooking(bookingId, 'Cancelled from User Dashboard');
      if (res.success) {
        fetchBookings();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-100">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">My Railway Reservations</h1>
          <p className="text-xs text-muted mt-1">
            Simulated ticket bookings stored in PostgreSQL and managed through Reservation Service.
          </p>
        </div>

        <Link
          to="/trains"
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start"
        >
          <Train className="w-3.5 h-3.5" />
          <span>Book New Train</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['ALL', 'CONFIRMED', 'CANCELLED'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filterStatus === status
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-white text-navy-800 border border-ivory-100 hover:bg-ivory-50'
            }`}
          >
            {status} ({bookings.filter((b) => (status === 'ALL' ? true : b.status === status)).length})
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-36 animate-pulse border border-ivory-100 p-6"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 border border-ivory-100">
          <Ticket className="w-12 h-12 text-muted mx-auto" />
          <h3 className="font-serif text-lg font-bold text-navy-900">No Reservations Found</h3>
          <p className="text-xs text-muted leading-relaxed">
            You do not currently have any {filterStatus !== 'ALL' ? filterStatus.toLowerCase() : ''} train bookings.
          </p>
          <Link
            to="/trains"
            className="inline-block bg-navy-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl"
          >
            Search Available Trains
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl p-6 border border-ivory-100 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-ivory-100 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-sm text-navy-900 bg-ivory-50 px-2.5 py-1 rounded-md border border-ivory-100">
                    {booking.pnr}
                  </span>
                  <span className="text-xs font-medium text-muted">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      booking.status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {booking.status === 'CONFIRMED' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    <span>{booking.status}</span>
                  </span>
                </div>
              </div>

              {/* Train and Route */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4 space-y-1">
                  <h3 className="font-serif font-bold text-lg text-navy-900">
                    {booking.trainNumber} {booking.trainName}
                  </h3>
                  <div className="text-xs text-muted">
                    Class: <strong className="text-navy-900">{booking.travelClass}</strong> • {booking.passengers.length} Passenger(s)
                  </div>
                </div>

                <div className="md:col-span-5 flex items-center gap-3 text-xs text-navy-900">
                  <div>
                    <div className="font-bold text-sm">{booking.departureTime}</div>
                    <div className="text-muted">{booking.sourceStationName}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-sm">{booking.arrivalTime}</div>
                    <div className="text-muted">{booking.destinationStationName}</div>
                  </div>
                </div>

                <div className="md:col-span-3 text-left md:text-right space-y-2">
                  <div className="text-sm font-serif font-bold text-emerald-700">₹{booking.totalFare}</div>
                  <div className="flex flex-wrap md:justify-end gap-2">
                    <Link
                      to={`/dashboard/bookings/${booking.id}`}
                      className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Ticket</span>
                    </Link>
                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 transition-colors"
                      >
                        {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
