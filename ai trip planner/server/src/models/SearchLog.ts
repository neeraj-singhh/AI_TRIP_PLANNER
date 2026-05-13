import { Schema, model } from 'mongoose';

const searchLogSchema = new Schema(
  {
    departure: String,
    destination: String,
    startDate: Date,
    endDate: Date,
    numPeople: Number,
    category: String,
    preferredTransport: String,
    prices: Schema.Types.Mixed,
    recommendedMode: String
  },
  { timestamps: true }
);

export const SearchLog = model('SearchLog', searchLogSchema);

