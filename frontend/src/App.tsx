import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ExploreDestinationsPage } from './pages/ExploreDestinationsPage';
import { DestinationDetailsPage } from './pages/DestinationDetailsPage';
import { FindTrainsPage } from './pages/FindTrainsPage';
import { TrainSearchResultsPage } from './pages/TrainSearchResultsPage';
import { HeritageCulturePage } from './pages/HeritageCulturePage';
import { HeritageDetailsPage } from './pages/HeritageDetailsPage';
import { SustainableTravelPage } from './pages/SustainableTravelPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

// User Dashboard Pages
import { UserDashboardPage } from './pages/UserDashboardPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { BookingDetailsPage } from './pages/BookingDetailsPage';
import { MyItinerariesPage } from './pages/MyItinerariesPage';
import { CreateItineraryPage } from './pages/CreateItineraryPage';
import { SavedDestinationsPage } from './pages/SavedDestinationsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminTrainsPage } from './pages/AdminTrainsPage';
import { AdminStationsPage } from './pages/AdminStationsPage';
import { AdminBookingsPage } from './pages/AdminBookingsPage';
import { AdminDestinationsPage } from './pages/AdminDestinationsPage';
import { AdminAttractionsPage } from './pages/AdminAttractionsPage';
import { AdminHeritagePage } from './pages/AdminHeritagePage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminActivityLogsPage } from './pages/AdminActivityLogsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/destinations" element={<ExploreDestinationsPage />} />
        <Route path="/destinations/:id" element={<DestinationDetailsPage />} />
        <Route path="/trains" element={<FindTrainsPage />} />
        <Route path="/trains/search" element={<TrainSearchResultsPage />} />
        <Route path="/heritage" element={<HeritageCulturePage />} />
        <Route path="/heritage/:id" element={<HeritageDetailsPage />} />
        <Route path="/sustainable-travel" element={<SustainableTravelPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* 2. Authenticated User Dashboard */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<UserDashboardPage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="bookings/:id" element={<BookingDetailsPage />} />
        <Route path="itineraries" element={<MyItinerariesPage />} />
        <Route path="itineraries/create" element={<CreateItineraryPage />} />
        <Route path="saved" element={<SavedDestinationsPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="settings" element={<AccountSettingsPage />} />
      </Route>

      {/* 3. Admin Control Center */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="trains" element={<AdminTrainsPage />} />
        <Route path="stations" element={<AdminStationsPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="destinations" element={<AdminDestinationsPage />} />
        <Route path="attractions" element={<AdminAttractionsPage />} />
        <Route path="heritage" element={<AdminHeritagePage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="activity-logs" element={<AdminActivityLogsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
