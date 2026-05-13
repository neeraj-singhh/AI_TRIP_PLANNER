import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/ai-trip-planner',
  mapsApiKey: process.env.MAPS_API_KEY || '',
  amadeusApiKey: process.env.AMADEUS_API_KEY || '',
  amadeusApiSecret: process.env.AMADEUS_API_SECRET || '',
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS) || 300
};

