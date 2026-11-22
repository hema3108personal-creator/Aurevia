import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Train as TrainIcon,
  Clock,
  ArrowRight,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { Train, TrainClassFare, Booking } from '../types';
import { TrainSearchWidget } from '../components/TrainSearchWidget';
import { BookingModal } from '../components/BookingModal';

export const TrainSearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const from = searchParams.get('from') || 'MAS';
  const to = searchParams.get('to') || 'ERS';
  const journeyDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const travelClass = searchParams.get('travelClass') || 'ALL';

  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'departure' | 'duration' | 'fare'>('departure');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>(travelClass);

  // Booking modal state
  const [activeBookingTrain, setActiveBookingTrain] = useState<Train | null>(null);
  const [activeBookingClass, setActiveBookingClass] = useState<TrainClassFare | null>(null);

  useEffect(() => {
    setLoading(true);
    api.searchTrains({
      from,
      to,
      date: journeyDate,
      travelClass: selectedClassFilter,
      sortBy,
    })
      .then((res) => {
        if (res.success && res.trains) {
          setTrains(res.trains);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [from, to, journeyDate, selectedClassFilter, sortBy]);

  const handleOpenBooking = (train: Train, cls: TrainClassFare) => {
    setActiveBookingTrain(train);
    setActiveBookingClass(cls);
  };

  const handleBookingSuccess = (booking: Booking) => {
    // Optionally redirect to booking details
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Search Modify Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-ivory-100 p-4">
        <TrainSearchWidget
          initialFrom={from}
          initialTo={to}
          initialDate={journeyDate}
          initialClass={selectedClassFilter}
        />
      </div>

      {/* Control Bar: Filters & Sorters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-ivory-100 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-navy-900 font-medium">
          <span className="font-bold text-base">{trains.length} Trains</span>
          <span className="text-muted">available on route {from} → {to}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sorting */}
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-muted" />
            <span className="font-semibold text-muted uppercase">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-ivory-50 border border-ivory-100 rounded-lg px-2.5 py-1.5 font-medium text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
            >
              <option value="departure">Earliest Departure</option>
              <option value="duration">Shortest Duration</option>
              <option value="fare">Lowest Fare</option>
            </select>
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-muted" />
            <span className="font-semibold text-muted uppercase">Class:</span>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="bg-ivory-50 border border-ivory-100 rounded-lg px-2.5 py-1.5 font-medium text-navy-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
            >
              <option value="ALL">All Classes</option>
              <option value="CC">AC Chair Car (CC)</option>
              <option value="EC">Executive Anubhuti (EC)</option>
              <option value="1A">AC First Class (1A)</option>
              <option value="2A">AC 2-Tier (2A)</option>
              <option value="3A">AC 3-Tier (3A)</option>
              <option value="SL">Sleeper (SL)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Train Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-ivory-100 p-6"></div>
          ))}
        </div>
      ) : trains.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 border border-ivory-100">
          <TrainIcon className="w-12 h-12 text-muted mx-auto" />
          <h3 className="font-serif text-xl font-bold text-navy-900">No Trains Found</h3>
          <p className="text-xs text-muted leading-relaxed">
            No direct simulated trains match this criteria between {from} and {to}. Try searching popular routes like <strong>Chennai (MAS) to Kochi (ERS)</strong>, <strong>Delhi (NDLS) to Agra (AGC)</strong>, or <strong>Mumbai (CSMT) to Goa (MAO)</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {trains.map((train) => (
            <div
              key={train.id}
              className="bg-white rounded-2xl p-6 border border-ivory-100 shadow-sm hover:shadow-md transition-all space-y-5"
            >
              {/* Header: Train Number, Name, Route */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ivory-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-sm">
                    <TrainIcon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-navy-900">
                      {train.trainName}
                    </h3>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Train #{train.trainNumber} • Runs: {train.operatingDays.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted font-medium flex items-center gap-2">
                  <span className="bg-ivory-100 text-navy-800 px-2.5 py-1 rounded-full font-semibold">
                    Simulated Inventory
                  </span>
                </div>
              </div>

              {/* Schedule Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-3">
                  <div className="text-2xl font-bold font-serif text-navy-900">{train.departureTime}</div>
                  <div className="text-sm font-semibold text-navy-800">{train.sourceStationName}</div>
                  <div className="text-xs text-muted">Station Code: {train.sourceStationCode}</div>
                </div>

                <div className="md:col-span-6 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold text-muted mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {train.durationFormatted}
                  </span>
                  <div className="w-full max-w-xs flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gold-500"></div>
                    <div className="flex-1 border-t-2 border-dashed border-ivory-100"></div>
                    <TrainIcon className="w-4 h-4 text-emerald-600" />
                    <div className="flex-1 border-t-2 border-dashed border-ivory-100"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                  </div>
                  <span className="text-[11px] text-muted mt-1">{train.distanceKm} km direct line</span>
                </div>

                <div className="md:col-span-3 text-left md:text-right">
                  <div className="text-2xl font-bold font-serif text-navy-900">{train.arrivalTime}</div>
                  <div className="text-sm font-semibold text-navy-800">{train.destinationStationName}</div>
                  <div className="text-xs text-muted">Station Code: {train.destinationStationCode}</div>
                </div>
              </div>

              {/* Class Options & Booking Pills */}
              <div className="pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-3">
                  Select Travel Class & Availability
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {train.classes.map((cls) => (
                    <div
                      key={cls.classCode}
                      className="p-3.5 bg-ivory-50/70 border border-ivory-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-navy-900">{cls.classCode}</span>
                          <span className="text-xs font-bold text-emerald-700">₹{cls.fare}</span>
                        </div>
                        <div className="text-[11px] text-muted truncate mt-0.5">{cls.className}</div>
                        <div className="text-[11px] font-semibold text-emerald-600 mt-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>AVL {cls.availableSeats}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenBooking(train, cls)}
                        className="mt-3 w-full bg-navy-900 hover:bg-emerald-600 text-white text-xs font-semibold py-1.5 rounded-lg shadow-sm transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {activeBookingTrain && activeBookingClass && (
        <BookingModal
          train={activeBookingTrain}
          selectedClass={activeBookingClass}
          journeyDate={journeyDate}
          isOpen={!!activeBookingTrain}
          onClose={() => {
            setActiveBookingTrain(null);
            setActiveBookingClass(null);
          }}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};
