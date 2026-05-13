import { env } from '../config/env';
import { ExternalQuote } from '../typings/pricing';
import { httpGetWithRetry } from '../utils/httpClient';

export async function getFlightQuote(
  fromCity: string,
  toCity: string,
  startDate: string,
  numPeople: number
): Promise<ExternalQuote | null> {
  if (!env.amadeusApiKey) {
    const roughDistanceFactor = fromCity === toCity ? 0.1 : 1;
    const basePerPerson = 3500 * roughDistanceFactor;
    return {
      mode: 'flight',
      provider: 'ai-fallback',
      currency: 'INR',
      pricePerPerson: basePerPerson
    };
  }

  try {
    const url = 'https://test.api.amadeus.com/v2/shopping/flight-offers';
    const data: any = await httpGetWithRetry(url, {
      headers: { Authorization: `Bearer ${env.amadeusApiKey}` },
      params: {
        originLocationCode: fromCity,
        destinationLocationCode: toCity,
        departureDate: startDate.slice(0, 10),
        adults: numPeople
      }
    });

    const first = data?.data?.[0];
    if (!first) return null;

    const price = Number(first.price.total) / Math.max(numPeople, 1);
    return {
      mode: 'flight',
      provider: 'amadeus',
      currency: first.price.currency || 'INR',
      pricePerPerson: price
    };
  } catch {
    return null;
  }
}

