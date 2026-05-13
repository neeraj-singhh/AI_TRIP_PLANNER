import { api } from './apiClient';

export interface TripPayload {
  departure: string;
  destination: string;
  startDate: string;
  endDate?: string;
  numPeople: number;
  category: string;
  preferredTransport?: string;
}

export async function fetchPricing(payload: TripPayload) {
  const res = await api.post('/pricing/quote', payload);
  return res.data;
}

