import { PricingRequest, PricingResult } from '../typings/pricing';

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  city: string;
  highlight: string;
  estimatedSpend: number;
}

export function buildItinerary(
  req: PricingRequest,
  chosen: PricingResult,
  routeDistanceKm: number
): ItineraryDay[] {
  const tripLengthDays = Math.max(2, Math.min(7, Math.round(routeDistanceKm / 300)));
  const city = req.destination;

  const baseDaily = Math.max(1200, chosen.perPerson * 0.18);
  const days: ItineraryDay[] = [];

  for (let i = 1; i <= tripLengthDays; i++) {
    days.push({
      day: i,
      city,
      title: i === 1 ? 'Arrival & Local Flavours' : `Explore ${city} – Day ${i}`,
      description:
        i === 1
          ? `Arrive in ${city}, settle in, and take an easy walk through a nearby market with local street food.`
          : `Discover another side of ${city} with a mix of sightseeing, cafes, and neighbourhood walks.`,
      highlight:
        i === tripLengthDays
          ? 'Wrap‑up with shopping for souvenirs and a relaxed final dinner.'
          : 'Include one signature attraction and one relaxed activity.',
      estimatedSpend: Math.round(baseDaily * (1 + (i - 1) * 0.1) * req.numPeople)
    });
  }

  return days;
}

