import React from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Train,
  Compass,
  Ticket,
  CalendarDays,
  Sparkles,
  Bookmark,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-50 text-navy-900 font-medium">
        Loading your travel dashboard...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Trains', path: '/trains', icon: Train },
    { name: 'Explore Destinations', path: '/destinations', icon: Compass },
    { name: 'My Bookings', path: '/dashboard/bookings', icon: Ticket },
    { name: 'My Itineraries', path: '/dashboard/itineraries', icon: CalendarDays },
    { name: 'Recommendations', path: '/dashboard/recommendations', icon: Sparkles },
    { name: 'Saved Places', path: '/dashboard/saved', icon: Bookmark },
    { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50 text-navy-900">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-ivory-100 p-5 space-y-6 sticky top-28">
              {/* User Mini Profile */}
              <div className="flex items-center gap-3 pb-5 border-b border-ivory-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-gold-500 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-serif font-bold text-navy-900 text-sm truncate">{user?.name}</h4>
                  <p className="text-xs text-muted truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {user?.role} Account
                  </span>
                </div>
              </div>

              {/* Navigation links */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
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

          {/* Main Dashboard Content Area */}
          <main className="lg:col-span-9">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};
