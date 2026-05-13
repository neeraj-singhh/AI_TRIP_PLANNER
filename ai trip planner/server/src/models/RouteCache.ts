import { Schema, model } from 'mongoose';

const routeCacheSchema = new Schema(
  {
    departure: { type: String, required: true },
    destination: { type: String, required: true },
    distanceKm: Number,
    durationMinutes: Number
  },
  { timestamps: true }
);

routeCacheSchema.index({ departure: 1, destination: 1 }, { unique: true });

export const RouteCache = model('RouteCache', routeCacheSchema);

