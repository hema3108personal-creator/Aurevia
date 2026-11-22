import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, ShieldCheck, Terminal, Filter } from 'lucide-react';
import { api } from '../services/api';

export const AdminActivityLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    api.getAdminActivityLogs()
      .then((res) => {
        if (res.success && res.logs) {
          setLogs(res.logs);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-100">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">System Activity Monitoring</h1>
          <p className="text-xs text-muted mt-1">
            Real-time event stream capturing RabbitMQ publications, routing keys, and microservices lifecycle.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Event Stream</span>
        </button>
      </div>

      <div className="bg-navy-950 rounded-3xl p-6 border border-navy-900 shadow-xl space-y-4 text-ivory-100 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-navy-800 text-[11px] text-ivory-100/60">
          <div className="flex items-center gap-2 text-gold-400 font-bold uppercase tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>EVENT AUDIT TRAIL (STDOUT & PERSISTENT LOG)</span>
          </div>
          <span>Showing latest {logs.length} logged events</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-ivory-100/50">Fetching events from API Gateway...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-ivory-100/50">No events logged yet.</div>
        ) : (
          <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-2">
            {logs.map((line, idx) => {
              const isBooking = line.includes('booking.');
              const isUser = line.includes('user.');
              const isItin = line.includes('itinerary.');

              return (
                <div
                  key={idx}
                  className="p-3 bg-navy-900/90 rounded-xl border border-navy-800 hover:border-gold-500/40 transition-colors leading-relaxed break-all"
                >
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mr-2 ${
                      isBooking
                        ? 'bg-emerald-900/80 text-emerald-300'
                        : isUser
                        ? 'bg-blue-900/80 text-blue-300'
                        : isItin
                        ? 'bg-purple-900/80 text-purple-300'
                        : 'bg-navy-800 text-gold-400'
                    }`}
                  >
                    EVENT
                  </span>
                  <span className="text-ivory-100/90">{line}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
