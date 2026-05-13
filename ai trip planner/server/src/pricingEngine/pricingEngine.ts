import {
  PricingRequest,
  PricingResult,
  RouteInfo,
  ExternalQuote,
  TransportMode
} from '../typings/pricing';
import {
  distanceMultiplier,
  seasonMultiplier,
  weekendMultiplier,
  advanceBookingMultiplier,
  categoryMultiplier,
  peopleMultiplier,
  surgeMultiplier
} from './factors';

const BASE_FARES_PER_KM: Record<TransportMode, number> = {
  flight: 6.5,
  train: 1.8,
  bus: 2.4,
  car: 4.0
};

export function buildPricing(
  req: PricingRequest,
  route: RouteInfo,
  externalQuotes: ExternalQuote[],
  weatherFactor: number
): PricingResult[] {
  const start = new Date(req.startDate);
  const hour = start.getHours();
  const modes: TransportMode[] = ['flight', 'train', 'bus', 'car'];

  return modes.map(mode => {
    const ext = externalQuotes.find(q => q.mode === mode);
    const baseKmFare = ext ? ext.pricePerPerson / Math.max(route.distanceKm, 1) : BASE_FARES_PER_KM[mode];

    const distMul = distanceMultiplier(route.distanceKm, mode);
    const seasonMul = seasonMultiplier(start, mode);
    const weekendMul = weekendMultiplier(start);
    const advMul = advanceBookingMultiplier(start);
    const catMul = categoryMultiplier(req.category, mode);
    const pplMul = peopleMultiplier(req.numPeople);
    const surgeMul = surgeMultiplier(hour, mode);
    const weatherMul = weatherFactor;

    const basePricePerPerson = baseKmFare * route.distanceKm * distMul;

    const totalMultiplier =
      seasonMul *
      weekendMul *
      advMul *
      catMul *
      pplMul *
      surgeMul *
      weatherMul;

    const totalPrice = Math.round(basePricePerPerson * totalMultiplier * req.numPeople);
    const perPerson = Math.round(totalPrice / req.numPeople);

    return {
      mode,
      totalPrice,
      perPerson,
      currency: 'INR',
      etaMinutes: Math.round(route.durationMinutes * (mode === 'flight' ? 0.7 : mode === 'car' ? 0.9 : 1)),
      breakdown: {
        basePricePerPerson,
        distanceKm: route.distanceKm,
        distanceMultiplier: distMul,
        seasonMultiplier: seasonMul,
        weekendMultiplier: weekendMul,
        advanceBookingMultiplier: advMul,
        weatherMultiplier: weatherMul,
        surgeMultiplier: surgeMul,
        categoryMultiplier: catMul,
        peopleMultiplier: pplMul,
        totalPrice
      }
    };
  });
}

