import React from 'react';
import { useTripForm } from '../hooks/useTripForm';
import { useLivePricing } from '../hooks/useLivePricing';
import { TripForm } from '../components/TripForm';
import { PriceCards } from '../components/PriceCards';
import { RecommendationBanner } from '../components/RecommendationBanner';
import { ItineraryTable } from '../components/ItineraryTable';

export const PlannerPage: React.FC = () => {
  const { state, update } = useTripForm();
  const { data, loading, error } = useLivePricing(state);

  const prices = data?.prices || [];
  const recommendation = data?.recommendation;
  const itinerary = data?.itinerary;

  return (
    <>
      <header className="hero-header">
        <div className="hero-content">
          <div className="logo-title">
            <h1>AI Trip Planner</h1>
            <p>Plan smarter. Travel better. Let AI handle the rest.</p>
          </div>
        </div>
      </header>

      <main className="page-shell">
        <section className="planner-shell">
          <div className="planner-card">
            <div className="planner-card-left">
              <h2>Plan Your Perfect Trip</h2>
              <p className="section-subtitle">
                Tune your preferences and watch prices update in real time.
              </p>
              <TripForm value={state} onChange={update} />
            </div>

            <div className="planner-card-right">
              <h3>Transportation Live Prices</h3>
              <p className="section-subtitle">
                {state.departure && state.destination
                  ? `Prices for ${state.departure} → ${state.destination}`
                  : 'Choose a route to see live prices.'}
              </p>
              {error && <div className="error-banner">{error}</div>}
              <PriceCards
                prices={prices}
                preferredMode={recommendation?.bestMode ?? state.preferredTransport}
                loading={loading}
              />
            </div>
          </div>

          <RecommendationBanner recommendation={recommendation} />
          <ItineraryTable days={itinerary} />
        </section>
      </main>

      <footer className="page-footer">
        <p>© 2024 AI Trip Planner. All rights reserved.</p>
      </footer>
    </>
  );
};

