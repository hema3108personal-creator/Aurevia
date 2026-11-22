// AUREVIA Event Contracts and Schema Constants

export const RABBITMQ_CONFIG = {
  EXCHANGE_NAME: 'aurevia.events',
  EXCHANGE_TYPE: 'topic',
  DEAD_LETTER_EXCHANGE: 'aurevia.dlx',
  QUEUES: {
    NOTIFICATIONS: 'aurevia.queue.notifications',
    ANALYTICS: 'aurevia.queue.analytics',
    RECOMMENDATIONS: 'aurevia.queue.recommendations',
    DEAD_LETTER: 'aurevia.queue.dead_letter',
  },
  ROUTING_KEYS: {
    USER_REGISTERED: 'user.registered',
    BOOKING_INITIATED: 'booking.initiated',
    BOOKING_CONFIRMED: 'booking.confirmed',
    BOOKING_CANCELLED: 'booking.cancelled',
    DESTINATION_VIEWED: 'destination.viewed',
    RECOMMENDATION_GENERATED: 'recommendation.generated',
    ITINERARY_CREATED: 'itinerary.created',
    ITINERARY_UPDATED: 'itinerary.updated',
    ALL_BOOKINGS: 'booking.*',
    ALL_USER_EVENTS: 'user.*',
    ALL_EVENTS: '#',
  },
};

export interface BaseEvent<T = any> {
  eventId: string;
  eventType: string;
  timestamp: string;
  version: string;
  payload: T;
}

export interface UserRegisteredPayload {
  userId: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  timestamp: string;
}

export interface BookingInitiatedPayload {
  bookingId: string;
  userId: string;
  trainId: string;
  trainNumber: string;
  journeyDate: string;
  timestamp: string;
}

export interface BookingConfirmedPayload {
  bookingId: string;
  pnr: string;
  userId: string;
  trainId: string;
  trainNumber: string;
  trainName: string;
  fromStation: string;
  toStation: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  travelClass: string;
  passengers: Array<{
    name: string;
    age: number;
    gender: string;
    seatPreference?: string;
    seatNumber?: string;
  }>;
  totalFare: number;
  status: 'CONFIRMED';
  timestamp: string;
}

export interface BookingCancelledPayload {
  bookingId: string;
  pnr: string;
  userId: string;
  trainNumber: string;
  journeyDate: string;
  reason?: string;
  timestamp: string;
}

export interface DestinationViewedPayload {
  userId?: string;
  destinationId: string;
  destinationName: string;
  category: string;
  timestamp: string;
}

export interface RecommendationGeneratedPayload {
  userId: string;
  recommendedIds: string[];
  matchScore: number;
  timestamp: string;
}

export interface ItineraryCreatedPayload {
  itineraryId: string;
  userId: string;
  title: string;
  destinationId: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  timestamp: string;
}

export interface ItineraryUpdatedPayload {
  itineraryId: string;
  userId: string;
  title: string;
  timestamp: string;
}

export type AureviaEvent =
  | (BaseEvent<UserRegisteredPayload> & { eventType: typeof RABBITMQ_CONFIG.ROUTING_KEYS.USER_REGISTERED })
  | (BaseEvent<BookingInitiatedPayload> & { eventType: typeof RABBITMQ_CONFIG.ROUTING_KEYS.BOOKING_INITIATED })
  | (BaseEvent<BookingConfirmedPayload> & { eventType: typeof RABBITMQ_CONFIG.ROUTING_KEYS.BOOKING_CONFIRMED })
  | (BaseEvent<BookingCancelledPayload> & { eventType: typeof RABBITMQ_CONFIG.ROUTING_KEYS.BOOKING_CANCELLED })
  | (BaseEvent<DestinationViewedPayload> & { eventType: typeof RABBITMQ_CONFIG.ROUTING_KEYS.DESTINATION_VIEWED })
  | (BaseEvent<RecommendationGeneratedPayload> & { eventType: typeof RABBITMQ_CONFIG.ROUTING_KEYS.RECOMMENDATION_GENERATED })
  | (BaseEvent<ItineraryCreatedPayload> & { eventType: typeof RABBITMQ_CONFIG.ROUTING_KEYS.ITINERARY_CREATED })
  | (BaseEvent<ItineraryUpdatedPayload> & { eventType: typeof RABBITMQ_CONFIG.ROUTING_KEYS.ITINERARY_UPDATED });
