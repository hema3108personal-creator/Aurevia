import React, { useState, useEffect } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { api } from '../services/api';
import { Station } from '../types';

export const AdminStationsPage: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState('13.0827');
  const [lng, setLng] = useState('80.2707');

  const fetchStations = () => {
    setLoading(true);
    api.getStations().then((res) => {
      if (res.success && res.stations) {
        setStations(res.stations);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createStation({
        code: code.toUpperCase(),
        name,
        city,
        state,
        latitude: Number(lat),
        longitude: Number(lng),
      });
      if (res.success) {
        setShowAdd(false);
        setCode('');
        setName('');
        setCity('');
        setState('');
        fetchStations();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add station');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-100">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Station Management</h1>
          <p className="text-xs text-muted mt-1">
            Indian Railways junctions and terminals seeded into Railway Service.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Station</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-ivory-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted">Loading stations...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-50 text-muted uppercase font-semibold border-b border-ivory-100">
                <tr>
                  <th className="py-3.5 px-4">Station Code</th>
                  <th className="py-3.5 px-4">Station Name</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">State</th>
                  <th className="py-3.5 px-4">Geographic Coordinates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-100">
                {stations.map((s) => (
                  <tr key={s.id} className="hover:bg-ivory-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy-900">{s.code}</td>
                    <td className="py-3.5 px-4 font-medium text-navy-900">{s.name}</td>
                    <td className="py-3.5 px-4 text-muted">{s.city}</td>
                    <td className="py-3.5 px-4 text-muted">{s.state}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-muted">
                      {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-ivory-100 space-y-4">
            <h3 className="font-serif font-bold text-xl text-navy-900">Add Railway Station</h3>
            <form onSubmit={handleAddStation} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-muted mb-1">Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MAS"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-muted mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chennai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-muted mb-1">Full Station Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chennai Central"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-muted mb-1">State</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tamil Nadu"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-muted mb-1">Latitude</label>
                  <input
                    type="text"
                    required
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-muted mb-1">Longitude</label>
                  <input
                    type="text"
                    required
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 bg-ivory-100 text-navy-800 py-2.5 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium"
                >
                  Save Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
