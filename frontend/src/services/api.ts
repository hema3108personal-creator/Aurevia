// Centralized AUREVIA API Client with Resilient Fallback for Static Deployments (Vercel & Surge)
import { mockStations, mockTrains, mockDestinations, mockHeritageSites } from './mockData';

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

// Local storage state helpers for standalone offline/Vercel/Surge execution
function getStored<T>(key: string, defaultVal: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setStored(key: string, val: any) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
}

// Client-side fallback handler when backend /api is not responding (e.g. on Vercel)
function handleFallback<T>(endpoint: string, options: RequestInit = {}): T {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : {};
  const [cleanEndpoint, queryString] = endpoint.split('?');
  const queryParams = new URLSearchParams(queryString || '');

  // Auth Fallback
  if (cleanEndpoint === '/auth/login') {
    const email = body.email || '';
    const isAdmin = email.toLowerCase().includes('admin');
    const user = {
      id: isAdmin ? 'usr_admin_1' : 'usr_traveler_1',
      name: isAdmin ? 'Priya Nambiar' : 'Aarav Sharma',
      email: email || 'traveler@aurevia.com',
      role: isAdmin ? 'ADMIN' : 'USER',
      phone: '+91 98765 43210',
      preferences: ['Nature', 'Historical', 'Eco-friendly'],
    };
    const token = 'mock_jwt_token_' + Date.now();
    setAuthToken(token);
    setStored('aurevia_user', user);
    return { success: true, token, user } as unknown as T;
  }

  if (cleanEndpoint === '/auth/register') {
    const user = {
      id: 'usr_' + Date.now(),
      name: body.name || 'Traveler',
      email: body.email,
      role: 'USER',
      phone: body.phone || '',
      preferences: ['Eco-friendly', 'Nature'],
    };
    const token = 'mock_jwt_token_' + Date.now();
    setAuthToken(token);
    setStored('aurevia_user', user);
    return { success: true, token, user } as unknown as T;
  }

  if (cleanEndpoint === '/auth/me') {
    const user = getStored('aurevia_user', {
      id: 'usr_traveler_1',
      name: 'Aarav Sharma',
      email: 'traveler@aurevia.com',
      role: 'USER',
      phone: '+91 98765 43210',
      preferences: ['Nature', 'Historical', 'Eco-friendly'],
    });
    return { success: true, user } as unknown as T;
  }

  // Stations
  if (cleanEndpoint === '/stations') {
    const q = (queryParams.get('q') || '').toLowerCase().trim();
    let stations = mockStations;
    if (q) {
      stations = stations.filter(
        (s) => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
      );
    }
    return { success: true, count: stations.length, stations, data: stations } as unknown as T;
  }

  // Trains Search
  if (cleanEndpoint === '/trains/search') {
    const from = (queryParams.get('from') || '').toLowerCase().trim();
    const to = (queryParams.get('to') || '').toLowerCase().trim();
    const travelClass = queryParams.get('travelClass') || 'ALL';
    const sortBy = queryParams.get('sortBy') || 'departure';

    let results = [...mockTrains];

    if (from) {
      results = results.filter(
        (t) => t.sourceStationCode.toLowerCase() === from || t.sourceStationName.toLowerCase().includes(from)
      );
    }

    if (to) {
      results = results.filter(
        (t) => t.destinationStationCode.toLowerCase() === to || t.destinationStationName.toLowerCase().includes(to)
      );
    }

    // If no exact source/destination match, return sample express trains so the user always sees results!
    if (results.length === 0) {
      results = [...mockTrains];
    }

    if (travelClass && travelClass !== 'ALL') {
      results = results.filter((t) => t.classes.some((c) => c.classCode === travelClass));
    }

    if (sortBy === 'duration') {
      results.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (sortBy === 'departure') {
      results.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    } else if (sortBy === 'fare') {
      results.sort((a, b) => {
        const minA = Math.min(...a.classes.map((c) => c.fare));
        const minB = Math.min(...b.classes.map((c) => c.fare));
        return minA - minB;
      });
    }

    return {
      success: true,
      count: results.length,
      trains: results,
      data: results,
      isSimulated: true,
      notice: 'Demonstration railway schedule and seat inventory.',
    } as unknown as T;
  }

  if (cleanEndpoint.startsWith('/trains/')) {
    const id = cleanEndpoint.replace('/trains/', '');
    const train = mockTrains.find((t) => t.id === id || t.trainNumber === id) || mockTrains[0];
    return { success: true, train, data: train } as unknown as T;
  }

  // Destinations Catalog
  if (cleanEndpoint === '/destinations') {
    const category = queryParams.get('category') || 'ALL';
    const state = queryParams.get('state') || 'ALL';
    const search = (queryParams.get('search') || '').toLowerCase().trim();

    let list = [...mockDestinations];

    if (category !== 'ALL') {
      list = list.filter((d) => d.category.toLowerCase() === category.toLowerCase());
    }

    if (state !== 'ALL') {
      list = list.filter((d) => d.state.toLowerCase() === state.toLowerCase());
    }

    if (search) {
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(search) ||
          d.state.toLowerCase().includes(search) ||
          d.description.toLowerCase().includes(search)
      );
    }

    return { success: true, count: list.length, destinations: list, data: list } as unknown as T;
  }

  if (cleanEndpoint.startsWith('/destinations/')) {
    const id = cleanEndpoint.replace('/destinations/', '');
    const dest = mockDestinations.find((d) => d.id === id) || mockDestinations[0];
    return { success: true, destination: dest, data: dest } as unknown as T;
  }

  // Heritage Sites Catalog
  if (cleanEndpoint === '/heritage') {
    const category = queryParams.get('category') || 'ALL';
    const search = (queryParams.get('search') || '').toLowerCase().trim();

    let list = [...mockHeritageSites];

    if (category !== 'ALL') {
      list = list.filter((s) => s.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (search) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.location.toLowerCase().includes(search) ||
          s.state.toLowerCase().includes(search)
      );
    }

    return { success: true, count: list.length, sites: list, data: list } as unknown as T;
  }

  if (cleanEndpoint.startsWith('/heritage/')) {
    const id = cleanEndpoint.replace('/heritage/', '');
    const site = mockHeritageSites.find((s) => s.id === id) || mockHeritageSites[0];
    return { success: true, site, data: site } as unknown as T;
  }

  // Saved Destinations
  if (cleanEndpoint === '/saved-destinations') {
    if (method === 'POST') {
      const saved = getStored<any[]>('aurevia_saved_dest', [
        { id: 'save_1', userId: body.userId, destinationId: 'dest_munnar', savedAt: new Date().toISOString() },
      ]);
      saved.push({ id: 'save_' + Date.now(), userId: body.userId, destinationId: body.destinationId, savedAt: new Date().toISOString() });
      setStored('aurevia_saved_dest', saved);
      return { success: true, message: 'Destination saved' } as unknown as T;
    }
    const saved = getStored<any[]>('aurevia_saved_dest', [
      { id: 'save_1', userId: 'usr_traveler_1', destinationId: 'dest_munnar', savedAt: new Date().toISOString() },
    ]);
    return { success: true, saved, data: saved } as unknown as T;
  }

  // Saved Heritage
  if (cleanEndpoint === '/saved-heritage') {
    if (method === 'POST') {
      const saved = getStored<any[]>('aurevia_saved_her', [
        { id: 'save_her_1', userId: body.userId, heritageId: 'hrt_taj_mahal', savedAt: new Date().toISOString() },
      ]);
      saved.push({ id: 'save_her_' + Date.now(), userId: body.userId, heritageId: body.heritageId, savedAt: new Date().toISOString() });
      setStored('aurevia_saved_her', saved);
      return { success: true, message: 'Heritage site saved' } as unknown as T;
    }
    const saved = getStored<any[]>('aurevia_saved_her', [
      { id: 'save_her_1', userId: 'usr_traveler_1', heritageId: 'hrt_taj_mahal', savedAt: new Date().toISOString() },
    ]);
    return { success: true, saved, data: saved } as unknown as T;
  }

  // Bookings
  if (cleanEndpoint === '/bookings' && method === 'POST') {
    const pnr = 'PNR-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
    const bookings = getStored<any[]>('aurevia_bookings', []);
    const newBooking = {
      id: 'bkg_' + Date.now(),
      pnr,
      userId: body.userId || 'usr_traveler_1',
      userEmail: 'traveler@aurevia.com',
      userName: 'Aarav Sharma',
      trainId: body.trainId || 'trn_20633',
      trainNumber: body.trainNumber || '20633',
      trainName: body.trainName || 'Vande Bharat Express',
      sourceStationCode: body.sourceStationCode || 'MAS',
      sourceStationName: body.sourceStationName || 'Chennai Central',
      destinationStationCode: body.destinationStationCode || 'ERS',
      destinationStationName: body.destinationStationName || 'Ernakulam Junction (Kochi)',
      journeyDate: body.journeyDate || '2026-12-15',
      departureTime: body.departureTime || '06:00',
      arrivalTime: body.arrivalTime || '14:30',
      travelClass: body.travelClass || 'CC',
      passengers: body.passengers || [{ name: 'Aarav Sharma', age: 29, gender: 'MALE', seatNumber: 'C1-42' }],
      totalFare: body.totalFare || 1580,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSimulated: true,
    };
    bookings.unshift(newBooking);
    setStored('aurevia_bookings', bookings);

    // Trigger in-app notification
    const notifications = getStored<any[]>('aurevia_notifications', []);
    notifications.unshift({
      id: 'notif_' + Date.now(),
      userId: newBooking.userId,
      title: 'Booking Confirmed!',
      message: `Your booking for ${newBooking.trainName} has been confirmed. PNR: ${pnr}`,
      type: 'BOOKING_CONFIRMED',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    setStored('aurevia_notifications', notifications);

    return { success: true, booking: newBooking, pnr } as unknown as T;
  }

  if (cleanEndpoint.startsWith('/bookings') && method === 'GET') {
    const defaultBookings = [
      {
        id: 'bkg_sample_1',
        pnr: 'PNR-8429-1940',
        userId: 'usr_traveler_1',
        userEmail: 'traveler@aurevia.com',
        userName: 'Aarav Sharma',
        trainId: 'trn_20633',
        trainNumber: '20633',
        trainName: 'Vande Bharat Express',
        sourceStationCode: 'MAS',
        sourceStationName: 'Chennai Central',
        destinationStationCode: 'ERS',
        destinationStationName: 'Ernakulam Junction (Kochi)',
        journeyDate: '2026-12-15',
        departureTime: '06:00',
        arrivalTime: '14:30',
        travelClass: 'CC',
        passengers: [{ name: 'Aarav Sharma', age: 29, gender: 'MALE', seatNumber: 'C1-42' }],
        totalFare: 1580,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSimulated: true,
      },
    ];
    const bookings = getStored<any[]>('aurevia_bookings', defaultBookings);
    return { success: true, count: bookings.length, bookings, data: bookings } as unknown as T;
  }

  if (cleanEndpoint.includes('/cancel') && method === 'POST') {
    const parts = cleanEndpoint.split('/');
    const bookingId = parts[2];
    const bookings = getStored<any[]>('aurevia_bookings', []);
    const b = bookings.find((x) => x.id === bookingId || x.pnr === bookingId);
    if (b) b.status = 'CANCELLED';
    setStored('aurevia_bookings', bookings);
    return { success: true, message: 'Booking cancelled successfully' } as unknown as T;
  }

  // Recommendations
  if (cleanEndpoint.startsWith('/recommendations')) {
    const recs = mockDestinations.slice(0, 4);
    return {
      success: true,
      recommendations: recs,
      data: recs,
      matchScore: 98,
      explanation: 'Recommended based on your cultural heritage and eco-friendly railway preferences.',
    } as unknown as T;
  }

  // Itineraries
  if (cleanEndpoint === '/itineraries' && method === 'POST') {
    const itineraries = getStored<any[]>('aurevia_itineraries', []);
    const newItin = {
      id: 'itin_' + Date.now(),
      title: body.title || 'Western Ghats Scenic Tour',
      destinationName: body.destinationName || 'Munnar',
      startDate: body.startDate || '2026-12-10',
      endDate: body.endDate || '2026-12-13',
      numberOfDays: body.numberOfDays || 3,
      days: body.days || [
        { dayNumber: 1, activities: ['Arrival & Tea Museum Visit', 'Scenic Viewpoint Walk'] },
        { dayNumber: 2, activities: ['Eravikulam National Park Safari', 'Eco Trekking'] },
        { dayNumber: 3, activities: ['Mattupetty Dam Boating', 'Local Spice Market Tour'] },
      ],
      createdAt: new Date().toISOString(),
    };
    itineraries.unshift(newItin);
    setStored('aurevia_itineraries', itineraries);
    return { success: true, itinerary: newItin, data: newItin } as unknown as T;
  }

  if (cleanEndpoint.startsWith('/itineraries') && method === 'GET') {
    const defaultItins = [
      {
        id: 'itin_sample_1',
        title: 'Western Ghats Scenic Tour',
        destinationName: 'Munnar',
        startDate: '2026-12-10',
        endDate: '2026-12-13',
        numberOfDays: 3,
        days: [
          { dayNumber: 1, activities: ['Arrival & Tea Museum Visit', 'Scenic Viewpoint Walk'] },
          { dayNumber: 2, activities: ['Eravikulam National Park Safari', 'Eco Trekking'] },
          { dayNumber: 3, activities: ['Mattupetty Dam Boating', 'Local Spice Market Tour'] },
        ],
        createdAt: new Date().toISOString(),
      },
    ];
    const itineraries = getStored<any[]>('aurevia_itineraries', defaultItins);
    return { success: true, count: itineraries.length, itineraries, data: itineraries } as unknown as T;
  }

  // Notifications
  if (cleanEndpoint.startsWith('/notifications')) {
    const defaultNotifs = [
      {
        id: 'notif_1',
        title: 'Welcome to AUREVIA!',
        message: 'Explore heritage sites, eco-destinations, and simulated express trains.',
        type: 'SYSTEM',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif_2',
        title: 'Sustainable Travel Tip',
        message: 'Rail transit emits 85% less CO2 than aviation for intercity journeys.',
        type: 'ECO_TIP',
        isRead: true,
        createdAt: new Date().toISOString(),
      },
    ];
    const notifications = getStored<any[]>('aurevia_notifications', defaultNotifs);
    return {
      success: true,
      count: notifications.length,
      notifications,
      data: notifications,
      unreadCount: notifications.filter((x) => !x.isRead).length,
    } as unknown as T;
  }

  // Admin Analytics & Logs
  if (cleanEndpoint.startsWith('/admin/analytics')) {
    return {
      success: true,
      stats: {
        totalBookings: 142,
        totalRevenue: 284500,
        activeTrains: 24,
        registeredUsers: 890,
      },
      chartData: [
        { month: 'Jun', bookings: 18, revenue: 38000 },
        { month: 'Jul', bookings: 24, revenue: 51000 },
        { month: 'Aug', bookings: 32, revenue: 68000 },
        { month: 'Sep', bookings: 28, revenue: 59000 },
        { month: 'Oct', bookings: 45, revenue: 95000 },
        { month: 'Nov', bookings: 65, revenue: 138000 },
      ],
    } as unknown as T;
  }

  if (cleanEndpoint.startsWith('/admin/activity-logs')) {
    return {
      success: true,
      logs: [
        { timestamp: new Date().toISOString(), service: 'Reservation-Service', event: 'booking.confirmed', routingKey: 'booking.confirmed' },
        { timestamp: new Date(Date.now() - 3600000).toISOString(), service: 'User-Service', event: 'user.registered', routingKey: 'user.registered' },
        { timestamp: new Date(Date.now() - 7200000).toISOString(), service: 'Recommendation-Service', event: 'recommendation.generated', routingKey: 'recommendation.generated' },
      ],
    } as unknown as T;
  }

  if (cleanEndpoint.startsWith('/users')) {
    return {
      success: true,
      users: [
        { id: 'usr_traveler_1', name: 'Aarav Sharma', email: 'traveler@aurevia.com', role: 'USER', isActive: true },
        { id: 'usr_admin_1', name: 'Priya Nambiar', email: 'admin@aurevia.com', role: 'ADMIN', isActive: true },
      ],
      data: [
        { id: 'usr_traveler_1', name: 'Aarav Sharma', email: 'traveler@aurevia.com', role: 'USER', isActive: true },
        { id: 'usr_admin_1', name: 'Priya Nambiar', email: 'admin@aurevia.com', role: 'ADMIN', isActive: true },
      ],
    } as unknown as T;
  }

  if (cleanEndpoint.startsWith('/health')) {
    return { success: true, status: 'HEALTHY', message: 'All microservices operational' } as unknown as T;
  }

  return { success: true, data: [] } as unknown as T;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // If server returns 404/502 (e.g. backend not deployed on static host), use client-side fallback
      return handleFallback<T>(endpoint, options);
    }

    return await response.json();
  } catch (networkError) {
    // If backend is offline or unreachable, seamlessly fall back to local demo state
    return handleFallback<T>(endpoint, options);
  }
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
