import React, { useState } from 'react';
import { Settings, Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AccountSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setMessage('Password changed successfully (simulated update).');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="pb-4 border-b border-ivory-100">
        <h1 className="font-serif text-3xl font-bold text-navy-900">Account Settings</h1>
        <p className="text-xs text-muted mt-1">
          Security credentials, password management, and data session settings.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-100 shadow-sm space-y-6">
        <h3 className="font-serif font-bold text-lg text-navy-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          Change Password
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all"
          >
            Update Password
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-ivory-100 shadow-sm space-y-3">
        <h3 className="font-serif font-bold text-lg text-navy-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Active Session & Security Details
        </h3>
        <p className="text-xs text-muted leading-relaxed">
          Your account is secured with JWT Bearer tokens and bcrypt salted hashes. Sessions are validated against User Service on port 5001 through API Gateway.
        </p>
      </div>
    </div>
  );
};
