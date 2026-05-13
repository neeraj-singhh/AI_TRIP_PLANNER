import NodeCache from 'node-cache';
import { env } from '../config/env';

const cache = new NodeCache({ stdTTL: env.cacheTtlSeconds, checkperiod: 60 });

export function getCache<T>(key: string): T | undefined {
  return cache.get<T>(key);
}

export function setCache<T>(key: string, value: T, ttlSeconds?: number) {
  cache.set(key, value, ttlSeconds);
}

