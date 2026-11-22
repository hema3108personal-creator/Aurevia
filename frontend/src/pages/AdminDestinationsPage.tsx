import React, { useState, useEffect } from 'react';
import { Compass, Plus, Trash2, MapPin, Leaf } from 'lucide-react';
import { api } from '../services/api';
import { Destination } from '../types';

export const AdminDestinationsPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [category, setCategory] = useState('Nature');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80');
  const [days, setDays] = useState(3);
  const [ecoScore, setEcoScore] = useState(90);
  const [nearestStation, setNearestStation] = useState('MAS');

  const fetchDestinations = () => {
    setLoading(true);
    api.getDestinations()
      .then((res) => {
        if (res.success && res.destinations) {
          setDestinations(res.destinations);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createDestination({
        name,
        state,
        country: 'India',
        category,
        description,
        coverImage,
        galleryImages: [coverImage],
        highlights: ['Scenic Trails', 'Heritage Sites', 'Local Cuisine'],
        bestTimeToVisit: 'October to March',
        estimatedVisitDurationDays: Number(days),
        latitude: 10.0889,
        longitude: 77.0595,
        ecoFriendlyScore: Number(ecoScore),
        sustainableTips: ['Use electric rail transit', 'Support indigenous artisans'],
        nearestStationCode: nearestStation,
        nearestStationName: nearestStation,
      });

      if (res.success) {
        setShowAdd(false);
        setName('');
        setState('');
        setDescription('');
        fetchDestinations();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add destination');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;
    try {
      await api.deleteDestination(id);
      fetchDestinations();
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-100">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Destination Management</h1>
          <p className="text-xs text-muted mt-1">
            Curated tourism destinations and regional categories in Tourism Service.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Destination</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-ivory-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted">Loading destinations...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-50 text-muted uppercase font-semibold border-b border-ivory-100">
                <tr>
                  <th className="py-3.5 px-4">Destination</th>
                  <th className="py-3.5 px-4">State</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Eco Score</th>
                  <th className="py-3.5 px-4">Nearest Rail Hub</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-100">
                {destinations.map((d) => (
                  <tr key={d.id} className="hover:bg-ivory-50/50">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-navy-900">{d.name}</div>
                      <div className="text-[10px] text-muted line-clamp-1">{d.description}</div>
                    </td>
                    <td className="py-3.5 px-4">{d.state}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-ivory-100 text-navy-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {d.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{d.estimatedVisitDurationDays} Days</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">{d.ecoFriendlyScore}/100</td>
                    <td className="py-3.5 px-4 font-mono">{d.nearestStationCode}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="p-1.5 text-muted hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete destination"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-ivory-100 space-y-4">
            <h3 className="font-serif font-bold text-xl text-navy-900">Add New Destination</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-muted mb-1">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Munnar"
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
                    placeholder="e.g. Kerala"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-muted mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                  >
                    <option value="Nature">Nature</option>
                    <option value="Historical">Historical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Beach">Beach</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase text-muted mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min={1}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-muted mb-1">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-muted mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of tourist appeal..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-muted mb-1">Eco Score (0-100)</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={ecoScore}
                    onChange={(e) => setEcoScore(Number(e.target.value))}
                    className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-muted mb-1">Nearest Station Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ERS"
                    value={nearestStation}
                    onChange={(e) => setNearestStation(e.target.value.toUpperCase())}
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
                  Create Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
