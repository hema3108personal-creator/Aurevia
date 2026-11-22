import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
          <h2 className="font-serif text-2xl font-bold text-navy-900">Reset Password</h2>
          <p className="text-xs text-muted">Enter your registered email to receive recovery instructions.</p>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif font-bold text-lg text-navy-900">Recovery Email Dispatched</h4>
            <p className="text-xs text-muted leading-relaxed">
              If an account is associated with <strong>{email}</strong>, password reset guidance has been sent.
            </p>
            <Link
              to="/login"
              className="inline-block mt-4 text-xs font-semibold text-emerald-700 hover:underline"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
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

            <button
              type="submit"
              className="w-full bg-navy-900 hover:bg-navy-800 text-white font-medium py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span>Send Recovery Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-muted pt-2 border-t border-ivory-100">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
