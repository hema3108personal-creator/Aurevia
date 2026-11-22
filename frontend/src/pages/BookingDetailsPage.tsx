import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Train,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  ArrowLeft,
  Calendar,
  Users,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { Booking } from '../types';

export const BookingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getBooking(id)
      .then((res) => {
        if (res.success && res.booking) {
          setBooking(res.booking);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-muted font-medium">
        Loading ticket information and event traces...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center space-y-4 max-w-md mx-auto">
        <h3 className="font-serif text-lg font-bold text-navy-900">Reservation Not Found</h3>
        <Link to="/dashboard/bookings" className="text-xs font-semibold text-emerald-700 hover:underline">
          Return to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-ivory-100">
        <button
          onClick={() => navigate('/dashboard/bookings')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reservations</span>
        </button>

        <button
          onClick={handlePrint}
          className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save Ticket</span>
        </button>
      </div>

      {/* Editorial Boarding Pass / Ticket Container */}
      <div className="bg-white rounded-3xl border border-ivory-100 shadow-lg overflow-hidden">
        {/* Ticket Top Header */}
        <div className="bg-navy-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Train className="w-5 h-5 text-gold-400" />
              <span className="font-serif font-bold text-2xl tracking-wider">AUREVIA RAIL PASS</span>
            </div>
            <p className="text-xs text-ivory-100/70">
              Electronic Reservation Slip • Verified Microservices Outbox
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <div className="text-xs uppercase tracking-widest text-gold-400 font-semibold">PNR NUMBER</div>
            <div className="font-mono text-2xl font-bold tracking-widest">{booking.pnr}</div>
          </div>
        </div>

        {/* Status Banner */}
        <div
          className={`px-8 py-3 flex items-center justify-between text-xs font-bold ${
            booking.status === 'CONFIRMED'
              ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-100'
              : 'bg-red-50 text-red-800 border-b border-red-100'
          }`}
        >
          <span className="flex items-center gap-1.5">
            {booking.status === 'CONFIRMED' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span>STATUS: {booking.status}</span>
          </span>
          <span className="font-mono text-[11px]">Booking ID: {booking.id}</span>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Train Route & Times */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-ivory-50/70 p-6 rounded-2xl border border-ivory-100 items-center">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block mb-1">From Origin</span>
              <div className="font-bold text-lg text-navy-900">{booking.sourceStationName}</div>
              <div className="text-xs text-muted">Code: {booking.sourceStationCode} • Dept: {booking.departureTime}</div>
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                {booking.journeyDate}
              </span>
              <div className="text-sm font-serif font-bold text-navy-900">{booking.trainNumber} {booking.trainName}</div>
              <div className="text-xs text-muted">Class: {booking.travelClass}</div>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block mb-1">To Destination</span>
              <div className="font-bold text-lg text-navy-900">{booking.destinationStationName}</div>
              <div className="text-xs text-muted">Code: {booking.destinationStationCode} • Arrv: {booking.arrivalTime}</div>
            </div>
          </div>

          {/* Passenger Roster */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-lg text-navy-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Passenger Seat Allocations
            </h4>

            <div className="overflow-x-auto border border-ivory-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory-50 text-muted uppercase font-semibold border-b border-ivory-100">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Passenger Name</th>
                    <th className="py-3 px-4">Age</th>
                    <th className="py-3 px-4">Gender</th>
                    <th className="py-3 px-4">Preference</th>
                    <th className="py-3 px-4">Allocated Coach & Seat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-100">
                  {booking.passengers.map((p, idx) => (
                    <tr key={idx} className="hover:bg-ivory-50/50">
                      <td className="py-3 px-4 font-semibold text-navy-900">{idx + 1}</td>
                      <td className="py-3 px-4 font-medium text-navy-900">{p.name}</td>
                      <td className="py-3 px-4 text-muted">{p.age}</td>
                      <td className="py-3 px-4 text-muted">{p.gender}</td>
                      <td className="py-3 px-4 text-muted">{p.seatPreference || 'WINDOW'}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">{p.seatNumber || 'C2-18'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Event-Driven Architecture Audit Trace */}
          <div className="p-4 bg-navy-950 text-ivory-100/90 rounded-2xl text-xs space-y-2 border border-navy-900">
            <div className="flex items-center gap-2 font-mono text-gold-400 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Event-Driven Microservice Trace</span>
            </div>
            <p className="text-[11px] leading-relaxed text-ivory-100/70 font-mono">
              [RabbitMQ Exchange: aurevia.events] &rarr; Routing Key: booking.confirmed &rarr; Consumed by: NotificationService &rarr; Stored in: PostgreSQL
            </p>
          </div>

          {/* Fare Summary */}
          <div className="border-t border-ivory-100 pt-4 flex items-center justify-between text-sm">
            <span className="text-muted">Total Simulated Amount Paid:</span>
            <span className="font-serif font-bold text-2xl text-emerald-700">₹{booking.totalFare}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
