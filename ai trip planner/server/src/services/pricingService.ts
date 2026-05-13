import { PricingRequest, PricingResult } from '../typings/pricing';
import { getRouteInfo } from './distanceService';
import { getFlightQuote } from './flightService';
import { buildPricing } from '../pricingEngine/pricingEngine';
import { buildRecommendations } from '../ai/recommendationService';
import { buildItinerary } from '../ai/itineraryService';
import { SearchLog } from '../models/SearchLog';
import { getCache, setCache } from '../utils/cache';
import { getWeatherFactor } from './weatherService';

export async function getPricingAndRecommendations(
  payload: PricingRequest
) {
  const cacheKey = JSON.stringify(payload);
  const cached = getCache<any>(cacheKey);
  if (cached) return cached;

  const route = await getRouteInfo(payload.departure, payload.destination);

  const [flightQuote, weatherFactor] = await Promise.all([
    getFlightQuote(payload.departure, payload.destination, payload.startDate, payload.numPeople),
    getWeatherFactor(payload.destination, payload.startDate)
  ]);

  const externalQuotes = [flightQuote].filter(Boolean) as any[];

  const prices: PricingResult[] = buildPricing(
    payload,
    route,
    externalQuotes,
    weatherFactor
  );

  const rec = buildRecommendations(payload, prices);
  const recommendedPrice = prices.find(p => p.mode === rec.bestMode) ?? prices[0];

  const itinerary = buildItinerary(payload, recommendedPrice, route.distanceKm);

  const response = {
    route,
    prices,
    recommendation: rec,
    itinerary,
    meta: {
      weatherFactor,
      currency: 'INR'
    }
  };

  setCache(cacheKey, response, 120);
  await SearchLog.create({
    ...payload,
    prices,
    recommendedMode: rec.bestMode
  }).catch(() => undefined);

  return response;
}

