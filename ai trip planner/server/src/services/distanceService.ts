import { env } from '../config/env';
import { RouteCache } from '../models/RouteCache';
import { getCache, setCache } from '../utils/cache';
import { httpGetWithRetry } from '../utils/httpClient';
import { RouteInfo } from '../typings/pricing';

export async function getRouteInfo(
  departure: string,
  destination: string
): Promise<RouteInfo> {
  const key = `route:${departure}:${destination}`;
  const cached = getCache<RouteInfo>(key);
  if (cached) return cached;

  const doc = await RouteCache.findOne({ departure, destination }).lean<RouteInfo>().exec();
  if (doc) {
    setCache(key, doc, 3600);
    return doc;
  }

  let route: RouteInfo = {
    distanceKm: 900,
    durationMinutes: 900
  };

  if (env.mapsApiKey) {
    try {
      const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
      const data: any = await httpGetWithRetry(url, {
        params: {
          api_key: env.mapsApiKey,
          start: departure,
          end: destination
        }
      });
      const summary = data?.features?.[0]?.properties?.summary;
      if (summary) {
        route = {
          distanceKm: summary.distance / 1000,
          durationMinutes: summary.duration / 60
        };
      }
    } catch {
      route = approximateDistance(departure, destination);
    }
  } else {
    route = approximateDistance(departure, destination);
  }

  await RouteCache.findOneAndUpdate(
    { departure, destination },
    route,
    { upsert: true }
  );

  setCache(key, route, 3600);
  return route;
}

function approximateDistance(from: string, to: string): RouteInfo {
  const table: Record<string, Record<string, number>> = {
    'New Delhi': { Goa: 1890, Mumbai: 1410, Varanasi: 820 },
    Goa: { 'New Delhi': 1890, Mumbai: 590 },
    Mumbai: { 'New Delhi': 1410, Goa: 590 }
  };

  const dist =
    table[from]?.[to] ||
    table[to]?.[from] ||
    900;

  return {
    distanceKm: dist,
    durationMinutes: dist / 60 * 60
  };
}

