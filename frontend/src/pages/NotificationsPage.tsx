import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Ticket, Calendar, ShieldCheck, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Notification } from '../types';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    if (!user) return;
    setLoading(true);
    api.getNotifications(user.id)
      .then((res) => {
        if (res.success && res.notifications) {
          setNotifications(res.notifications);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      fetchNotifications();
    } catch (err) {}
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    try {
      await api.markAllNotificationsRead(user.id);
      fetchNotifications();
    } catch (err) {}
  };

  const getIcon = (type: string) => {
    if (type.includes('BOOKING')) return <Ticket className="w-4 h-4 text-emerald-600" />;
    if (type.includes('ITINERARY')) return <Calendar className="w-4 h-4 text-purple-600" />;
    return <Info className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-100">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Notifications & Event Alerts</h1>
          <p className="text-xs text-muted mt-1">
            Asynchronous messages processed via RabbitMQ consumer in Notification Service.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllAsRead}
            className="bg-white border border-ivory-100 hover:bg-ivory-50 text-navy-800 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-ivory-100 p-4"></div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 border border-ivory-100">
          <Bell className="w-12 h-12 text-muted mx-auto" />
          <h3 className="font-serif text-lg font-bold text-navy-900">No Notifications</h3>
          <p className="text-xs text-muted leading-relaxed">
            You are completely caught up! New booking updates and itinerary notices will be delivered here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !n.isRead
                  ? 'border-emerald-200 bg-emerald-50/20 shadow-sm'
                  : 'border-ivory-100 opacity-90'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-ivory-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-navy-900">{n.title}</h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-muted/70 block pt-1">
                    {new Date(n.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  className="self-end sm:self-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Read</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
