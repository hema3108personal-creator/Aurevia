import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, MessageSquare, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-semibold text-emerald-600">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl font-bold text-navy-900">
          Contact AUREVIA Support
        </h1>
        <p className="text-sm text-muted">
          Have inquiries regarding railway schedules, sustainable travel partnerships, or engineering architecture? Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div className="lg:col-span-5 bg-navy-900 text-white p-8 rounded-3xl space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-bold text-gold-400">Headquarters & Labs</h3>
            <p className="text-xs text-ivory-100/70 leading-relaxed">
              AUREVIA Engineering Capstone Lab, Dept. of Computer Science and Engineering.
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Tech Innovation Campus, Bengaluru, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>support@aurevia.travel / dev@aurevia.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>+91 (080) 4123-5678 (Mon–Fri 9am–6pm IST)</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-navy-800 rounded-2xl border border-navy-700 text-xs text-ivory-100/60 leading-relaxed">
            🚀 <strong>Viva Demonstration Helpdesk:</strong> For examiner evaluation, use the pre-seeded admin account <code>admin@aurevia.com</code> or traveler account <code>traveler@aurevia.com</code>.
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-ivory-100 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-navy-900">Message Received</h3>
              <p className="text-sm text-muted max-w-sm mx-auto">
                Thank you for contacting AUREVIA. Our engineering support desk has logged your inquiry and will respond shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. user@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="Inquiry Topic"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist your travel planning or research?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-ivory-50 border border-ivory-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-medium py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
