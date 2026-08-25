export const BOOKING_SERVICE_KEYS = ['general', 'urgency', 'visit'] as const;

export type BookingServiceKey = (typeof BOOKING_SERVICE_KEYS)[number];
