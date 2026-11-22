// AUREVIA Common Types
export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreference {
  id: string;
  userId: string;
  categories: string[];
  travelStyle?: string;
  preferredState?: string;
  availableDays?: number;
  dietaryPreference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Station {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface TrainClassFare {
  classCode: string; // '1A', '2A', '3A', 'SL', 'CC', 'EC'
  className: string;
  fare: number;
  totalSeats: number;
  availableSeats: number;
}

export interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  sourceStationId: string;
  sourceStationCode: string;
  sourceStationName: string;
  destinationStationId: string;
  destinationStationCode: string;
  destinationStationName: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  durationFormatted: string;
  operatingDays: string[];
  classes: TrainClassFare[];
  distanceKm: number;
  isSimulated: boolean;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Passenger {
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  seatPreference?: 'LOWER' | 'MIDDLE' | 'UPPER' | 'SIDE_LOWER' | 'SIDE_UPPER' | 'WINDOW' | 'ANY';
  seatNumber?: string;
}

export interface Booking {
  id: string;
  pnr: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  trainId: string;
  trainNumber: string;
  trainName: string;
  sourceStationCode: string;
  sourceStationName: string;
  destinationStationCode: string;
  destinationStationName: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  travelClass: string;
  passengers: Passenger[];
  totalFare: number;
  status: BookingStatus;
  idempotencyKey?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TouristSpot {
  id: string;
  name: string;
  destinationId: string;
  category: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  estimatedDurationHours: number;
  latitude: number;
  longitude: number;
  entryFee: number;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  country: string;
  coverImage: string;
  galleryImages: string[];
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  category: string;
  estimatedVisitDurationDays: number;
  latitude: number;
  longitude: number;
  popularAttractions: TouristSpot[];
  ecoFriendlyScore: number;
  sustainableTips: string[];
  nearestStationCode: string;
  nearestStationName: string;
}

export interface HeritageSite {
  id: string;
  name: string;
  location: string;
  state: string;
  category: 'Ancient Temples' | 'Historical Monuments' | 'Forts and Palaces' | 'Museums' | 'UNESCO World Heritage Sites' | 'Cultural Festivals' | 'Traditional Arts';
  coverPhotograph: string;
  gallery: string[];
  historicalBackground: string;
  culturalSignificance: string;
  architecturalDetails: string;
  visitingInformation: {
    timings: string;
    entryFee: string;
    bestSeason: string;
    guidelines: string[];
  };
  latitude: number;
  longitude: number;
  nearestStationCode: string;
  nearestStationName: string;
}

export interface Recommendation {
  id: string;
  userId: string;
  destinationId: string;
  destinationName: string;
  destinationImage: string;
  category: string;
  matchScore: number; // 0 - 100
  reason: string;
  state: string;
  attractions: string[];
  createdAt: string;
}

export interface ItineraryActivity {
  id: string;
  dayNumber: number;
  activityTitle: string;
  description?: string;
  timeSlot?: string;
  durationMinutes: number;
  attractionId?: string;
  attractionName?: string;
  orderIndex: number;
}

export interface Itinerary {
  id: string;
  userId: string;
  title: string;
  destinationId: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  notes?: string;
  activities: ItineraryActivity[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'BOOKING_CONFIRMATION' | 'BOOKING_CANCELLATION' | 'ITINERARY' | 'RECOMMENDATION' | 'SYSTEM';
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}
