import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Train, Shield, Heart, MapPin, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-ivory-100/80 border-t border-navy-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-900">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-gold-500 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-wider text-white">AUREVIA</span>
            </Link>
            <p className="text-sm text-ivory-100/60 leading-relaxed max-w-sm">
              An event-driven microservices architecture uniting smart tourism discovery, cultural heritage awareness, and simulated railway reservations into one connected travel ecosystem.
            </p>
            <div className="flex items-center gap-4 text-xs text-gold-400 font-medium">
              <span>Deep Midnight Navy</span>
              <span>•</span>
              <span>Emerald Green</span>
              <span>•</span>
              <span>Warm Ivory</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-white text-base">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/destinations" className="hover:text-gold-400 transition-colors">All Destinations</Link></li>
              <li><Link to="/destinations?category=Nature" className="hover:text-gold-400 transition-colors">Nature & Mountains</Link></li>
              <li><Link to="/destinations?category=Beach" className="hover:text-gold-400 transition-colors">Coastal Escapes</Link></li>
              <li><Link to="/destinations?category=Historical" className="hover:text-gold-400 transition-colors">Royal Fortresses</Link></li>
              <li><Link to="/dashboard/recommendations" className="hover:text-gold-400 transition-colors">AI Recommendations</Link></li>
            </ul>
          </div>

          {/* Railways & Heritage */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-white text-base">Railways & Heritage</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/trains" className="hover:text-gold-400 transition-colors">Find Trains</Link></li>
              <li><Link to="/heritage" className="hover:text-gold-400 transition-colors">UNESCO Heritage</Link></li>
              <li><Link to="/heritage?category=Ancient%20Temples" className="hover:text-gold-400 transition-colors">Ancient Temples</Link></li>
              <li><Link to="/sustainable-travel" className="hover:text-gold-400 transition-colors">Low-Carbon Railways</Link></li>
              <li><Link to="/sustainable-travel#emissions" className="hover:text-gold-400 transition-colors">Carbon Calculator</Link></li>
            </ul>
          </div>

          {/* Organization */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-white text-base">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">About AUREVIA</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Contact Support</Link></li>
              <li><Link to="/login" className="hover:text-gold-400 transition-colors">Traveler Sign In</Link></li>
              <li><Link to="/register" className="hover:text-gold-400 transition-colors">Create Account</Link></li>
              <li><Link to="/admin" className="hover:text-gold-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-ivory-100/50 gap-4">
          <p>© {new Date().getFullYear()} AUREVIA Travel-Tech Platform. Final Year Engineering Capstone Project.</p>
          <div className="flex items-center gap-6">
            <span>Simulated Railway Integration</span>
            <span>•</span>
            <span>RabbitMQ Event Driven</span>
            <span>•</span>
            <span>Microservices Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
