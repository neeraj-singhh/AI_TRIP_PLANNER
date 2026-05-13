import { Request, Response } from 'express';
import { getPricingAndRecommendations } from '../services/pricingService';

export async function quotePricing(req: Request, res: Response) {
  try {
    const body = req.body;

    const payload = {
      departure: body.departure,
      destination: body.destination,
      startDate: body.startDate,
      endDate: body.endDate,
      numPeople: Number(body.numPeople) || 1,
      category: body.category || 'budget',
      preferredTransport: body.preferredTransport
    };

    const data = await getPricingAndRecommendations(payload);
    res.json(data);
  } catch (err) {
    console.error('quotePricing error', err);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
}

