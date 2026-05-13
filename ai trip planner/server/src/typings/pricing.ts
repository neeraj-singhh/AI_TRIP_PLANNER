export type TransportMode = 'flight' | 'train' | 'bus' | 'car';

export interface PricingRequest {
  departure: string;
  destination: string;
  startDate: string;
  endDate?: string;
  numPeople: number;
  category: 'budget' | 'friends' | 'family' | 'group' | 'luxury';
  preferredTransport?: TransportMode;
}

export interface RouteInfo {
  distanceKm: number;
  durationMinutes: number;
}

export interface ExternalQuote {
  mode: TransportMode;
  provider: string;
  currency: string;
  pricePerPerson: number;
}

export interface PriceBreakdown {
  basePricePerPerson: number;
  distanceKm: number;
  distanceMultiplier: number;
  seasonMultiplier: number;
  weekendMultiplier: number;
  advanceBookingMultiplier: number;
  weatherMultiplier: number;
  surgeMultiplier: number;
  categoryMultiplier: number;
  peopleMultiplier: number;
  totalPrice: number;
}

export interface PricingResult {
  mode: TransportMode;
  totalPrice: number;
  currency: string;
  perPerson: number;
  breakdown: PriceBreakdown;
  etaMinutes: number;
}

