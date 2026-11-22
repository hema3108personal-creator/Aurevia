import React from 'react';
import { Train, ShieldAlert, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { TrainSearchWidget } from '../components/TrainSearchWidget';
import { Link } from 'react-router-dom';

export const FindTrainsPage: React.FC = () => {
  const popularRoutes = [
    { from: 'MAS', fromCity: 'Chennai', to: 'ERS', toCity: 'Kochi (Ernakulam)', trainName: 'Vande Bharat Express', time: '8h 30m' },
    { from: 'NDLS', fromCity: 'New Delhi', to: 'AGC', toCity: 'Agra Cantt', trainName: 'Bhopal Shatabdi', time: '1h 50m' },
    { from: 'CSMT', fromCity: 'Mumbai', to: 'MAO', toCity: 'Goa (Madgaon)', trainName: 'Jan Shatabdi Express', time: '9h 00m' },
    { from: 'NDLS', fromCity: 'New Delhi', to: 'JP', toCity: 'Jaipur Junction', trainName: 'Double Decker Superfast', time: '4h 30m' },
    { from: 'NDLS', fromCity: 'New Delhi', to: 'SBC', toCity: 'Bengaluru', trainName: 'Rajdhani Express', time: '33h 35m' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-semibold text-emerald-600">
          Seamless Railway Network
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy-900">
          Find Trains Across India
        </h1>
        <p className="text-sm text-muted">
          Connect your journey across major cultural hubs and scenic natural corridors with simulated real-time schedule and seat availability tracking.
        </p>
      </div>

      {/* Main Search Panel */}
      <div className="max-w-5xl mx-auto">
        <TrainSearchWidget className="shadow-lg border border-ivory-100" />
      </div>

      {/* Simulated Notice Banner */}
      <div className="max-w-5xl mx-auto p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Academic Capstone Notice:</strong> AUREVIA demonstrates a true event-driven microservices architecture using RabbitMQ, transactional outbox logging, and resilient asynchronous notification handling. Seat availability and ticket reservations are simulated demonstration data; no actual IRCTC railway tickets are purchased or issued.
        </div>
      </div>

      {/* Featured Scenic Rail Lines */}
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block">
            Popular High-Demand Corridors
          </span>
          <h2 className="font-serif text-2xl font-bold text-navy-900 mt-1">
            Featured Railway Routes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularRoutes.map((route, idx) => (
            <Link
              key={idx}
              to={`/trains/search?from=${route.from}&to=${route.to}`}
              className="bg-white rounded-2xl p-5 border border-ivory-100 shadow-sm hover:shadow-md hover:border-gold-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-muted font-medium mb-2">
                  <span className="flex items-center gap-1">
                    <Train className="w-3.5 h-3.5 text-gold-500" />
                    {route.trainName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {route.time}
                  </span>
                </div>
                <div className="font-serif font-bold text-lg text-navy-900 group-hover:text-emerald-700 transition-colors">
                  {route.fromCity} → {route.toCity}
                </div>
                <div className="text-xs text-muted mt-1">
                  Codes: {route.from} to {route.to}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-ivory-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
                <span>View Daily Schedules</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
