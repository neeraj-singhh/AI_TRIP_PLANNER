import { env } from '../config/env';
import { httpGetWithRetry } from '../utils/httpClient';

export async function getWeatherFactor(city: string, dateIso: string): Promise<number> {
  if (!env.weatherApiKey) {
    return 1.0;
  }

  try {
    const url = 'https://api.openweathermap.org/data/2.5/weather';
    const data: any = await httpGetWithRetry(url, {
      params: { q: city, appid: env.weatherApiKey }
    });

    const main = data?.weather?.[0]?.main || '';
    if (/storm|thunder|snow/i.test(main)) return 1.2;
    if (/rain/i.test(main)) return 1.1;
    if (/clear/i.test(main)) return 0.95;
  } catch {
    // ignore
  }

  return 1.0;
}

