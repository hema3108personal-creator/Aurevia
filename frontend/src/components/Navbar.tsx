import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Train, Landmark, Leaf, User as UserIcon, Bell, LogOut, Menu, X, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Notification } from '../types';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      api.getUnreadCount(user.id).then((res) => {
        if (res.success) setUnreadCount(res.unreadCount);
      }).catch(() => {});

      api.getNotifications(user.id).then((res) => {
        if (res.success && res.notifications) {
          setRecentNotifications(res.notifications.slice(0, 5));
        }
      }).catch(() => {});
    }
  }, [isAuthenticated, user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Trains', path: '/trains', icon: Train },
    { name: 'Destinations', path: '/destinations', icon: Compass },
    { name: 'Heritage', path: '/heritage', icon: Landmark },
    { name: 'Sustainable Travel', path: '/sustainable-travel', icon: Leaf },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-md border-b border-navy-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-gold-500 flex items-center justify-center shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl tracking-wider text-white">AUREVIA</span>
            <span className="block text-[10px] tracking-widest text-gold-400 uppercase -mt-1 font-medium">Smart Travel & Heritage</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'text-white bg-navy-800 shadow-inner'
                    : 'text-ivory-100/80 hover:text-white hover:bg-navy-800/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User / Auth CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-ivory-100 hover:text-white transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-ivory-100 text-navy-900 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-ivory-100 flex items-center justify-between">
                      <span className="font-serif font-bold text-sm">Notifications</span>
                      <Link
                        to="/dashboard/notifications"
                        onClick={() => setShowNotifications(false)}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        View All
                      </Link>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-ivory-50">
                      {recentNotifications.length > 0 ? (
                        recentNotifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3.5 text-xs hover:bg-ivory-50/80 transition-colors ${!n.isRead ? 'bg-emerald-50/40' : ''}`}
                          >
                            <div className="font-semibold text-navy-900">{n.title}</div>
                            <div className="text-muted mt-0.5 line-clamp-2">{n.message}</div>
                            <div className="text-[10px] text-muted/80 mt-1">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-muted">No notifications yet.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dashboard / Role Navigation */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-white text-sm font-medium transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gold-500 text-navy-950 font-bold flex items-center justify-center text-xs">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span>{user?.name?.split(' ')[0]}</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider transition-all"
                  title="Admin Portal"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl hover:bg-navy-800 text-ivory-100/70 hover:text-red-400 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-ivory-100 hover:text-white hover:bg-navy-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-lg transition-all"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center gap-2">
          {isAuthenticated && (
            <Link to="/dashboard" className="p-2 text-ivory-100">
              <UserIcon className="w-5 h-5" />
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-ivory-100 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-950 border-t border-navy-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm text-ivory-100 hover:bg-navy-800"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-navy-800 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm bg-navy-800 text-white font-medium"
                >
                  Dashboard ({user?.name})
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm bg-emerald-700 text-white font-medium"
                  >
                    Admin Control Center
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-navy-800"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-xl text-sm border border-navy-700 text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-xl text-sm bg-emerald-600 text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
