import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, AlertCircle, ArrowRight, Shield, User, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoRole: 'TRAVELER' | 'ADMIN') => {
    setLoading(true);
    setError(null);
    try {
      if (demoRole === 'TRAVELER') {
        await login({ email: 'traveler@aurevia.com', password: 'Traveler@12345' });
        navigate('/dashboard', { replace: true });
      } else {
        await login({ email: 'admin@aurevia.com', password: 'Admin@12345' });
        navigate('/admin', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-ivory-100 max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-gold-500 flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-2xl tracking-wider text-navy-900">AUREVIA</span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-navy-900">Welcome Back</h2>
          <p className="text-xs text-muted">Sign in to manage railway reservations and itineraries.</p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Evaluation Buttons */}
        <div className="p-3.5 bg-ivory-50 rounded-2xl border border-ivory-100 space-y-2">
          <div className="text-[11px] font-semibold text-muted uppercase tracking-wider text-center">
            ⚡ Quick-Fill Demo Accounts (Viva & Evaluation)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('TRAVELER')}
              className="py-2 px-3 rounded-xl bg-white border border-ivory-100 hover:border-emerald-500 text-navy-900 text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demo Traveler</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ADMIN')}
              className="py-2 px-3 rounded-xl bg-white border border-ivory-100 hover:border-gold-500 text-navy-900 text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-gold-500" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-emerald-600 hover:underline">
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ivory-50/80 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-muted pt-2 border-t border-ivory-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-emerald-700 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
