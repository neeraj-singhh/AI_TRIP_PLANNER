import React from 'react';
import { formatCurrency } from '../utils/format';

interface Props {
  prices: any[];
  preferredMode?: string;
  loading: boolean;
}

const icons: Record<string, string> = {
  flight: '✈️',
  train: '🚆',
  bus: '🚌',
  car: '🚗'
};

export const PriceCards: React.FC<Props> = ({ prices, preferredMode, loading }) => {
  if (loading) {
    return (
      <div className="price-list">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="price-row skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="price-list">
      {prices.map(p => (
        <div
          key={p.mode}
          className={
            'price-row ' +
            `price-row-${p.mode} ` +
            (preferredMode === p.mode ? 'is-selected' : '')
          }
        >
          <div className="price-label">
            <span className="price-icon">{icons[p.mode]}</span>
            <span>{p.mode.charAt(0).toUpperCase() + p.mode.slice(1)}</span>
          </div>
          <div className="price-value">
            {formatCurrency(p.totalPrice)}{' '}
            <span style={{ opacity: 0.7 }}>/ ~{Math.round(p.etaMinutes / 60)}h</span>
          </div>
        </div>
      ))}
    </div>
  );
};

