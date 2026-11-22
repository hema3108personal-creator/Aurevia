import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, Shield, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const UserProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.updateProfile({ name, phone });
      if (res.success) {
        await refreshUser();
        setMessage('Profile updated successfully!');
      }
    } catch (err: any) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="pb-4 border-b border-ivory-100">
        <h1 className="font-serif text-3xl font-bold text-navy-900">User Profile</h1>
        <p className="text-xs text-muted mt-1">
          Manage your personal details and account authentication identity.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-100 shadow-sm space-y-6">
        {/* Avatar & Badges */}
        <div className="flex items-center gap-4 pb-6 border-b border-ivory-100">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-gold-500 text-white font-bold text-2xl flex items-center justify-center shadow-md">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-navy-900">{user?.name}</h3>
            <p className="text-xs text-muted">{user?.email}</p>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
              <Shield className="w-3 h-3" />
              <span>{user?.role} Role</span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5" />
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Email Address (Fixed Account ID)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full bg-ivory-100/60 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              Mobile Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all"
            >
              {saving ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
