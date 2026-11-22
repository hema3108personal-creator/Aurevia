// Centralized AUREVIA API Client connected to API Gateway

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('aurevia_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('aurevia_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('aurevia_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({ success: false, message: 'Invalid response from server' }));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<any>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData: { name: string; email: string; password: string; phone?: string }) =>
    request<any>('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request<any>('/auth/me'),
  updateProfile: (profile: any) => request<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(profile) }),
  getPreferences: () => request<any>('/auth/preferences'),
  updatePreferences: (pref: any) => request<any>('/auth/preferences', { method: 'PUT', body: JSON.stringify(pref) }),

  // Railway
  getStations: (query?: string) => request<any>(`/stations${query ? `?q=${encodeURIComponent(query)}` : ''}`),
  searchTrains: (params: Record<string, string>) => {
    const qs = new URLSearchParams(params).toString();
    return request<any>(`/trains/search?${qs}`);
  },
  getTrain: (id: string) => request<any>(`/trains/${id}`),
  getAvailability: (id: string, classCode?: string) =>
    request<any>(`/trains/${id}/availability${classCode ? `?class=${classCode}` : ''}`),

  // Reservations
  createBooking: (bookingData: any) =>
    request<any>('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  getUserBookings: (userId?: string) =>
    request<any>(`/bookings${userId ? `?userId=${userId}` : ''}`),
  getBooking: (id: string) => request<any>(`/bookings/${id}`),
  cancelBooking: (id: string, reason?: string) =>
    request<any>(`/bookings/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),

  // Tourism
  getDestinations: (params?: Record<string, string>) => {
    const qs = params ? new URLSearchParams(params).toString() : '';
    return request<any>(`/destinations${qs ? `?${qs}` : ''}`);
  },
  getDestination: (id: string) => request<any>(`/destinations/${id}`),
  getAttractions: () => request<any>('/attractions'),
  getSavedDestinations: (userId: string) => request<any>(`/saved-destinations?userId=${userId}`),
  saveDestination: (userId: string, destinationId: string) =>
    request<any>('/saved-destinations', { method: 'POST', body: JSON.stringify({ userId, destinationId }) }),
  removeSavedDestination: (userId: string, destinationId: string) =>
    request<any>(`/saved-destinations/${destinationId}?userId=${userId}`, { method: 'DELETE' }),

  // Heritage
  getHeritageSites: (params?: Record<string, string>) => {
    const qs = params ? new URLSearchParams(params).toString() : '';
    return request<any>(`/heritage${qs ? `?${qs}` : ''}`);
  },
  getHeritageSite: (id: string) => request<any>(`/heritage/${id}`),
  getSavedHeritage: (userId: string) => request<any>(`/saved-heritage?userId=${userId}`),
  saveHeritage: (userId: string, heritageId: string) =>
    request<any>('/saved-heritage', { method: 'POST', body: JSON.stringify({ userId, heritageId }) }),
  removeSavedHeritage: (userId: string, heritageId: string) =>
    request<any>(`/saved-heritage/${heritageId}?userId=${userId}`, { method: 'DELETE' }),

  // Recommendations
  generateRecommendations: (criteria: any) =>
    request<any>('/recommendations/generate', { method: 'POST', body: JSON.stringify(criteria) }),
  getRecommendations: (userId?: string) =>
    request<any>(`/recommendations${userId ? `?userId=${userId}` : ''}`),

  // Itinerary
  getItineraries: (userId?: string) =>
    request<any>(`/itineraries${userId ? `?userId=${userId}` : ''}`),
  getItinerary: (id: string) => request<any>(`/itineraries/${id}`),
  createItinerary: (data: any) =>
    request<any>('/itineraries', { method: 'POST', body: JSON.stringify(data) }),
  updateItinerary: (id: string, data: any) =>
    request<any>(`/itineraries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteItinerary: (id: string) =>
    request<any>(`/itineraries/${id}`, { method: 'DELETE' }),
  addItineraryActivity: (itineraryId: string, activity: any) =>
    request<any>(`/itineraries/${itineraryId}/activities`, { method: 'POST', body: JSON.stringify(activity) }),
  deleteItineraryActivity: (itineraryId: string, activityId: string) =>
    request<any>(`/itineraries/${itineraryId}/activities/${activityId}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: (userId?: string) =>
    request<any>(`/notifications${userId ? `?userId=${userId}` : ''}`),
  getUnreadCount: (userId?: string) =>
    request<any>(`/notifications/unread-count${userId ? `?userId=${userId}` : ''}`),
  markNotificationRead: (id: string) =>
    request<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: (userId?: string) =>
    request<any>('/notifications/read-all', { method: 'PATCH', body: JSON.stringify({ userId }) }),

  // Admin
  getAdminAnalytics: () => request<any>('/admin/analytics'),
  getAdminActivityLogs: () => request<any>('/admin/activity-logs'),
  getAdminUsers: () => request<any>('/users'),
  toggleUserStatus: (id: string, isActive: boolean) =>
    request<any>(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) }),
  getAdminBookings: () => request<any>('/bookings/all'),
  createTrain: (train: any) => request<any>('/trains', { method: 'POST', body: JSON.stringify(train) }),
  updateTrain: (id: string, train: any) => request<any>(`/trains/${id}`, { method: 'PUT', body: JSON.stringify(train) }),
  deleteTrain: (id: string) => request<any>(`/trains/${id}`, { method: 'DELETE' }),
  createStation: (station: any) => request<any>('/stations', { method: 'POST', body: JSON.stringify(station) }),
  createDestination: (dest: any) => request<any>('/destinations', { method: 'POST', body: JSON.stringify(dest) }),
  updateDestination: (id: string, dest: any) => request<any>(`/destinations/${id}`, { method: 'PUT', body: JSON.stringify(dest) }),
  deleteDestination: (id: string) => request<any>(`/destinations/${id}`, { method: 'DELETE' }),
  createHeritage: (site: any) => request<any>('/heritage', { method: 'POST', body: JSON.stringify(site) }),
  updateHeritage: (id: string, site: any) => request<any>(`/heritage/${id}`, { method: 'PUT', body: JSON.stringify(site) }),
  deleteHeritage: (id: string) => request<any>(`/heritage/${id}`, { method: 'DELETE' }),
  getSystemHealth: () => request<any>('/health'),
};
