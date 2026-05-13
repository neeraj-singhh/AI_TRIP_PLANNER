import React from 'react';

export const RecommendationBanner: React.FC<{ recommendation?: any }> = ({ recommendation }) => {
  if (!recommendation) return null;

  return (
    <div className="feature-card" style={{ marginTop: 16 }}>
      <h4>Smart Recommendation</h4>
      <p>{recommendation.explanation}</p>
    </div>
  );
}

