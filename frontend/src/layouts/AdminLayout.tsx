import React from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Train,
  MapPin,
  Ticket,
  Compass,
  Sparkles,
  Landmark,
  Layers,
  Activity,
  LogOut,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-50 text-navy-900 font-medium">
        Verifying administrator credentials...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4 border border-red-200">
          <Shield className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="font-serif text-xl font-bold text-navy-900">Access Restricted</h2>
          <p className="text-sm text-muted">
            Administrator permissions are required to access this portal. Please sign in with an administrative account.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-navy-900 text-white py-2.5 rounded-xl font-medium"
          >
            Return to User Dashboard
          </button>
        </div>
      </div>
    );
  }

  const adminMenuItems = [
    { name: 'Analytics & Overview', path: '/admin', icon: BarChart3 },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Train Management', path: '/admin/trains', icon: Train },
    { name: 'Station Management', path: '/admin/stations', icon: MapPin },
    { name: 'Booking Reservations', path: '/admin/bookings', icon: Ticket },
    { name: 'Destinations', path: '/admin/destinations', icon: Compass },
    { name: 'Attractions', path: '/admin/attractions', icon: Sparkles },
    { name: 'Cultural Heritage', path: '/admin/heritage', icon: Landmark },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'System Activity Logs', path: '/admin/activity-logs', icon: Activity },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50 text-navy-900">
      <Navbar />
      <div className="bg-navy-900 text-white py-4 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-400">
              AUREVIA Master Administration Portal
            </span>
          </div>
          <span className="text-xs text-ivory-100/60">
            Microservices Cluster • Event Driven • Port 5000 API Gateway
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Admin Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-ivory-100 p-5 space-y-6 sticky top-28">
              <div className="pb-4 border-b border-ivory-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Signed In As</span>
                <h4 className="font-serif font-bold text-navy-900 text-sm mt-0.5 truncate">{user?.name}</h4>
                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-navy-900 text-white text-[11px] font-semibold">
                  <Shield className="w-3 h-3 text-gold-400" />
                  SYSTEM ADMIN
                </div>
              </div>

              <nav className="space-y-1">
                {adminMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? 'bg-navy-900 text-white shadow-sm'
                          : 'text-navy-800 hover:bg-ivory-50 hover:text-navy-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-gold-400' : 'text-muted'}`} />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${active ? 'opacity-100' : 'opacity-0'}`} />
                    </Link>
                  );
                })}

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Admin Main View */}
          <main className="lg:col-span-9">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};
