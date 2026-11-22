import React, { useState, useEffect } from 'react';
import { Landmark, Plus, Trash2, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { HeritageSite } from '../types';

export const AdminHeritagePage: React.FC = () => {
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHeritage = () => {
    setLoading(true);
    api.getHeritageSites()
      .then((res) => {
        if (res.success && res.sites) {
          setSites(res.sites);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHeritage();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this heritage site?')) return;
    try {
      await api.deleteHeritage(id);
      fetchHeritage();
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-100">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Cultural Heritage Management</h1>
          <p className="text-xs text-muted mt-1">
            UNESCO World Heritage monuments, ancient temples, and forts in Heritage Service.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-ivory-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted">Loading heritage monuments...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-50 text-muted uppercase font-semibold border-b border-ivory-100">
                <tr>
                  <th className="py-3.5 px-4">Monument Name</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Visiting Hours</th>
                  <th className="py-3.5 px-4">Nearest Station</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-100">
                {sites.map((s) => (
                  <tr key={s.id} className="hover:bg-ivory-50/50">
                    <td className="py-3.5 px-4 font-bold text-navy-900">{s.name}</td>
                    <td className="py-3.5 px-4 text-muted">{s.location}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-gold-50 text-gold-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        {s.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted">{s.visitingInformation?.timings}</td>
                    <td className="py-3.5 px-4 font-mono">{s.nearestStationCode}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 text-muted hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete site"
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
    </div>
  );
};
