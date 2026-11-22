import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Clock, Coins } from 'lucide-react';
import { api } from '../services/api';
import { TouristSpot } from '../types';

export const AdminAttractionsPage: React.FC = () => {
  const [attractions, setAttractions] = useState<TouristSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getAttractions()
      .then((res) => {
        if (res.success && res.attractions) {
          setAttractions(res.attractions);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-ivory-100">
        <h1 className="font-serif text-3xl font-bold text-navy-900">Tourist Attractions Management</h1>
        <p className="text-xs text-muted mt-1">
          Points of interest, entry fees, and excursion duration metadata across destinations.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-ivory-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted">Loading attractions...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-50 text-muted uppercase font-semibold border-b border-ivory-100">
                <tr>
                  <th className="py-3.5 px-4">Attraction</th>
                  <th className="py-3.5 px-4">Destination ID</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Entry Tariff</th>
                  <th className="py-3.5 px-4">Coordinates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-100">
                {attractions.map((spot) => (
                  <tr key={spot.id} className="hover:bg-ivory-50/50">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-navy-900">{spot.name}</div>
                      <div className="text-[10px] text-muted line-clamp-1">{spot.description}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{spot.destinationId}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-ivory-100 text-navy-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {spot.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{spot.estimatedDurationHours} Hours</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700">
                      {spot.entryFee === 0 ? 'Free' : `₹${spot.entryFee}`}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-muted">
                      {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
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
