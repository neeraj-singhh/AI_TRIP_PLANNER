import { PricingRequest, PricingResult } from '../typings/pricing';

export interface RecommendationSummary {
  bestMode: string;
  cheapestMode: string;
  fastestMode: string;
  balancedMode: string;
  explanation: string;
}

export function buildRecommendations(
  req: PricingRequest,
  prices: PricingResult[]
): RecommendationSummary {
  const sortedByPrice = [...prices].sort((a, b) => a.totalPrice - b.totalPrice);
  const cheapest = sortedByPrice[0];

  const fastest = [...prices].sort((a, b) => a.etaMinutes - b.etaMinutes)[0];

  const score = (p: PricingResult) => {
    const priceNorm = p.totalPrice / (cheapest.totalPrice || 1);
    const timeNorm = p.etaMinutes / (fastest.etaMinutes || 1);
    const comfort =
      p.mode === 'flight' || p.mode === 'car'
        ? 0.9
        : p.mode === 'train'
        ? 1.0
        : 1.1;

    return priceNorm * 0.55 + timeNorm * 0.35 + comfort * 0.1;
  };

  const balanced = [...prices].sort((a, b) => score(a) - score(b))[0];

  const preferred = req.preferredTransport
    ? prices.find(p => p.mode === req.preferredTransport) ?? balanced
    : balanced;

  const explanation = buildExplanation(req, cheapest, fastest, balanced, preferred);

  return {
    bestMode: preferred.mode,
    cheapestMode: cheapest.mode,
    fastestMode: fastest.mode,
    balancedMode: balanced.mode,
    explanation
  };
}

function buildExplanation(
  req: PricingRequest,
  cheapest: PricingResult,
  fastest: PricingResult,
  balanced: PricingResult,
  best: PricingResult
): string {
  const people = req.numPeople;
  const savings = fastest.totalPrice - cheapest.totalPrice;
  const extraTime = balanced.etaMinutes - fastest.etaMinutes;

  return [
    `${capitalize(best.mode)} is recommended for this trip.`,
    `It balances cost (₹${balanced.totalPrice.toLocaleString('en-IN')} for ${people} people)`,
    `and travel time (~${Math.round(balanced.etaMinutes / 60)} hours).`,
    `Cheapest is ${cheapest.mode} saving around ₹${savings > 0 ? savings.toLocaleString('en-IN') : 0},`,
    `while fastest is ${fastest.mode} taking ~${Math.round(fastest.etaMinutes / 60)} hours`,
    `${extraTime > 0 ? `and the balanced option adds only ~${Math.round(extraTime / 60)} extra hours.` : '.'}`
  ].join(' ');
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

