import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft, Calendar, Search, Users, Train as TrainIcon } from 'lucide-react';
import { api } from '../services/api';
import { Station } from '../types';

interface TrainSearchWidgetProps {
  initialFrom?: string;
  initialTo?: string;
  initialDate?: string;
  initialClass?: string;
  className?: string;
}

export const TrainSearchWidget: React.FC<TrainSearchWidgetProps> = ({
  initialFrom = 'MAS',
  initialTo = 'ERS',
  initialDate = '',
  initialClass = 'ALL',
  className = '',
}) => {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [fromCode, setFromCode] = useState(initialFrom);
  const [toCode, setToCode] = useState(initialTo);
  const [date, setDate] = useState(initialDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState(initialClass);

  useEffect(() => {
    api.getStations().then((res) => {
      if (res.success && res.stations) {
        setStations(res.stations);
      }
    }).catch(() => {});
  }, []);

  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from: fromCode,
      to: toCode,
      date,
      passengers: passengers.toString(),
      travelClass,
    });
    navigate(`/trains/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 md:p-6 border border-ivory-100/60 ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Source Station */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1 flex items-center gap-1.5">
            <TrainIcon className="w-3.5 h-3.5 text-gold-500" />
            From Station
          </label>
          <select
            value={fromCode}
            onChange={(e) => setFromCode(e.target.value)}
            className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
          >
            {stations.map((s) => (
              <option key={s.id} value={s.code}>
                {s.city} ({s.code}) – {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center pt-2 md:pt-4">
          <button
            type="button"
            onClick={handleSwap}
            className="p-2.5 rounded-full bg-ivory-100 hover:bg-gold-500 hover:text-white text-navy-800 transition-all shadow-sm"
            title="Swap source and destination"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Station */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1 flex items-center gap-1.5">
            <TrainIcon className="w-3.5 h-3.5 text-emerald-600" />
            To Station
          </label>
          <select
            value={toCode}
            onChange={(e) => setToCode(e.target.value)}
            className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
          >
            {stations.map((s) => (
              <option key={s.id} value={s.code}>
                {s.city} ({s.code}) – {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Journey Date */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-navy-700" />
            Journey Date
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
          />
        </div>

        {/* Passengers & Class */}
        <div className="md:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-navy-700" />
            Travelers
          </label>
          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-2.5 py-2.5 text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Search CTA */}
        <div className="md:col-span-2 pt-2 md:pt-4">
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-5 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all group"
          >
            <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Search Trains</span>
          </button>
        </div>
      </div>
    </form>
  );
};
