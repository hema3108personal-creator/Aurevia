import React, { useState, useEffect } from 'react';
import { Train, Plus, Trash2, Edit, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Train as TrainType } from '../types';

export const AdminTrainsPage: React.FC = () => {
  const [trains, setTrains] = useState<TrainType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTrainNumber, setNewTrainNumber] = useState('');
  const [newTrainName, setNewTrainName] = useState('');
  const [newSourceCode, setNewSourceCode] = useState('MAS');
  const [newDestCode, setNewDestCode] = useState('ERS');
  const [newDept, setNewDept] = useState('06:00');
  const [newArrv, setNewArrv] = useState('14:30');
  const [newFare, setNewFare] = useState(1580);

  const fetchTrains = () => {
    setLoading(true);
    api.searchTrains({})
      .then((res) => {
        if (res.success && res.trains) {
          setTrains(res.trains);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const handleAddTrain = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createTrain({
        trainNumber: newTrainNumber,
        trainName: newTrainName,
        sourceStationCode: newSourceCode,
        sourceStationName: newSourceCode,
        destinationStationCode: newDestCode,
        destinationStationName: newDestCode,
        departureTime: newDept,
        arrivalTime: newArrv,
        durationMinutes: 480,
        durationFormatted: '8h 00m',
        operatingDays: ['MON', 'WED', 'FRI', 'SUN'],
        distanceKm: 650,
        isSimulated: true,
        classes: [
          { classCode: 'CC', className: 'AC Chair Car', fare: Number(newFare), totalSeats: 120, availableSeats: 45 },
          { classCode: 'EC', className: 'Executive Class', fare: Number(newFare) * 1.8, totalSeats: 40, availableSeats: 12 },
        ],
      });
      if (res.success) {
        setShowAddModal(false);
        setNewTrainNumber('');
        setNewTrainName('');
        fetchTrains();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add train');
    }
  };

  const handleDeleteTrain = async (id: string) => {
    if (!confirm('Are you sure you want to delete this train?')) return;
    try {
      await api.deleteTrain(id);
      fetchTrains();
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-100">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Train Management</h1>
          <p className="text-xs text-muted mt-1">
            Simulated train schedules, fares, and coach inventories in Railway Service.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Simulated Train</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-ivory-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted">Loading trains...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-50 text-muted uppercase font-semibold border-b border-ivory-100">
                <tr>
                  <th className="py-3.5 px-4">Train #</th>
                  <th className="py-3.5 px-4">Train Name</th>
                  <th className="py-3.5 px-4">Route</th>
                  <th className="py-3.5 px-4">Timing</th>
                  <th className="py-3.5 px-4">Classes & Fares</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-100">
                {trains.map((t) => (
                  <tr key={t.id} className="hover:bg-ivory-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy-900">{t.trainNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-navy-900">{t.trainName}</td>
                    <td className="py-3.5 px-4 text-navy-800">
                      {t.sourceStationCode} → {t.destinationStationCode}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-muted">
                      {t.departureTime} – {t.arrivalTime} ({t.durationFormatted})
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {t.classes.map((c) => (
                          <span key={c.classCode} className="text-[10px] bg-ivory-100 px-1.5 py-0.5 rounded font-medium">
                            {c.classCode}: ₹{c.fare}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteTrain(t.id)}
                        className="p-1.5 text-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete train"
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

      {/* Add Train Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-ivory-100 space-y-4">
            <h3 className="font-serif font-bold text-xl text-navy-900">Add Simulated Train Service</h3>
            <form onSubmit={handleAddTrain} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-muted mb-1">Train Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20635"
                  value={newTrainNumber}
                  onChange={(e) => setNewTrainNumber(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-muted mb-1">Train Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Malabar Vande Bharat"
                  value={newTrainName}
                  onChange={(e) => setNewTrainName(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-muted mb-1">Origin Code</label>
                  <input
                    type="text"
                    required
                    value={newSourceCode}
                    onChange={(e) => setNewSourceCode(e.target.value.toUpperCase())}
                    className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-muted mb-1">Dest Code</label>
                  <input
                    type="text"
                    required
                    value={newDestCode}
                    onChange={(e) => setNewDestCode(e.target.value.toUpperCase())}
                    className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-muted mb-1">Departure Time</label>
                  <input
                    type="text"
                    required
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-muted mb-1">Base Fare (₹)</label>
                  <input
                    type="number"
                    required
                    value={newFare}
                    onChange={(e) => setNewFare(Number(e.target.value))}
                    className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-ivory-100 hover:bg-ivory-200 text-navy-800 py-2.5 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium"
                >
                  Create Train
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
