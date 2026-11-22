import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Train as TrainIcon, Users, Calendar, ShieldCheck } from 'lucide-react';
import { Train, TrainClassFare, Passenger, Booking } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface BookingModalProps {
  train: Train;
  selectedClass: TrainClassFare;
  journeyDate: string;
  initialPassengersCount?: number;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  train,
  selectedClass,
  journeyDate,
  initialPassengersCount = 1,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const { user } = useAuth();
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      name: user?.name || '',
      age: 28,
      gender: 'MALE',
      seatPreference: 'WINDOW',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const totalFare = passengers.length * selectedClass.fare;

  const handleAddPassenger = () => {
    if (passengers.length >= 6) return;
    setPassengers([
      ...passengers,
      { name: '', age: 25, gender: 'FEMALE', seatPreference: 'WINDOW' },
    ]);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length <= 1) return;
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to finalize your railway reservation.');
      return;
    }

    // Validate passengers
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name.trim()) {
        setError(`Please enter the full name for Passenger #${i + 1}`);
        return;
      }
    }

    setLoading(true);
    setError(null);

    const idempotencyKey = `idem_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    try {
      const res = await api.createBooking({
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        trainId: train.id,
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        sourceStationCode: train.sourceStationCode,
        sourceStationName: train.sourceStationName,
        destinationStationCode: train.destinationStationCode,
        destinationStationName: train.destinationStationName,
        journeyDate,
        departureTime: train.departureTime,
        arrivalTime: train.arrivalTime,
        travelClass: selectedClass.classCode,
        passengers,
        totalFare,
        idempotencyKey,
      });

      if (res.success && res.booking) {
        setConfirmedBooking(res.booking);
        onBookingSuccess(res.booking);
      } else {
        setError(res.message || 'Failed to complete reservation');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-ivory-100">
        {/* Header */}
        <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TrainIcon className="w-5 h-5 text-gold-500" />
            <div>
              <h3 className="font-serif font-bold text-lg">Railway Ticket Reservation</h3>
              <p className="text-xs text-muted">Simulated Booking System – Live Event Driven</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {confirmedBooking ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Booking Confirmed
                </span>
                <h4 className="font-serif text-2xl font-bold text-navy-900 mt-2">
                  PNR: {confirmedBooking.pnr}
                </h4>
                <p className="text-sm text-muted mt-1">
                  A confirmation event has been published to RabbitMQ and added to your dashboard notifications.
                </p>
              </div>

              <div className="bg-ivory-50 rounded-xl p-4 border border-ivory-100 text-left text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">Train:</span>
                  <span className="font-semibold text-navy-900">{confirmedBooking.trainNumber} – {confirmedBooking.trainName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Route:</span>
                  <span className="font-semibold text-navy-900">{confirmedBooking.sourceStationName} → {confirmedBooking.destinationStationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Date & Time:</span>
                  <span className="font-semibold text-navy-900">{confirmedBooking.journeyDate} at {confirmedBooking.departureTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Class & Passengers:</span>
                  <span className="font-semibold text-navy-900">{confirmedBooking.travelClass} ({confirmedBooking.passengers.length} Traveler(s))</span>
                </div>
                <div className="border-t border-ivory-100 pt-2 flex justify-between font-bold text-emerald-700">
                  <span>Total Amount Paid:</span>
                  <span>₹{confirmedBooking.totalFare}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200">
                ℹ️ <strong>Simulated Demonstration Notice:</strong> This reservation demonstrates microservice transactions, RabbitMQ event routing, and PostgreSQL outbox persistence. No real tickets are issued.
              </div>

              <button
                onClick={onClose}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-medium py-3 rounded-xl shadow-md transition-all"
              >
                Close & View My Bookings
              </button>
            </div>
          ) : (
            <form onSubmit={handleConfirmBooking} className="space-y-6">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Journey Summary Banner */}
              <div className="bg-navy-800/10 border border-navy-800/20 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                <div>
                  <span className="font-bold text-navy-900 text-base">{train.trainNumber} {train.trainName}</span>
                  <div className="text-muted text-xs mt-0.5">
                    {train.sourceStationCode} ({train.departureTime}) → {train.destinationStationCode} ({train.arrivalTime}) • {train.durationFormatted}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wider text-muted font-semibold">Travel Class</div>
                  <div className="font-bold text-emerald-700">{selectedClass.className} ({selectedClass.classCode}) – ₹{selectedClass.fare}/seat</div>
                </div>
              </div>

              {/* Passengers Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-navy-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    Passenger Information ({passengers.length}/6)
                  </h4>
                  {passengers.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddPassenger}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
                    >
                      + Add Passenger
                    </button>
                  )}
                </div>

                {passengers.map((p, idx) => (
                  <div key={idx} className="p-3.5 bg-ivory-50/70 border border-ivory-100 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-muted">
                      <span>Passenger #{idx + 1}</span>
                      {passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePassenger(idx)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                      <div className="md:col-span-5">
                        <input
                          type="text"
                          required
                          placeholder="Full Name (as per ID)"
                          value={p.name}
                          onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                          className="w-full bg-white border border-ivory-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="number"
                          required
                          min={1}
                          max={110}
                          placeholder="Age"
                          value={p.age}
                          onChange={(e) => handlePassengerChange(idx, 'age', Number(e.target.value))}
                          className="w-full bg-white border border-ivory-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <select
                          value={p.gender}
                          onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                          className="w-full bg-white border border-ivory-100 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div className="md:col-span-3">
                        <select
                          value={p.seatPreference || 'WINDOW'}
                          onChange={(e) => handlePassengerChange(idx, 'seatPreference', e.target.value)}
                          className="w-full bg-white border border-ivory-100 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                        >
                          <option value="WINDOW">Window</option>
                          <option value="LOWER">Lower Berth</option>
                          <option value="MIDDLE">Middle Berth</option>
                          <option value="UPPER">Upper Berth</option>
                          <option value="SIDE_LOWER">Side Lower</option>
                          <option value="ANY">No Preference</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fare Total and Submit */}
              <div className="border-t border-ivory-100 pt-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted">Total Simulated Fare</div>
                  <div className="text-2xl font-serif font-bold text-emerald-700">₹{totalFare}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-ivory-100 text-navy-800 text-sm font-medium hover:bg-ivory-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{loading ? 'Confirming...' : 'Confirm Reservation'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
