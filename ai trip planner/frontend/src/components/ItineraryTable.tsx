import React from 'react';
import { formatCurrency } from '../utils/format';

export const ItineraryTable: React.FC<{ days?: any[] }> = ({ days }) => {
  if (!days || days.length === 0) return null;

  return (
    <section className="itinerary-section visible">
      <h2>Your Trip Itinerary</h2>
      <div id="itinerary">
        <table id="itinerary-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Title</th>
              <th>Description</th>
              <th>Highlight</th>
              <th>Est. Spend</th>
            </tr>
          </thead>
          <tbody>
            {days.map(d => (
              <tr key={d.day}>
                <td>{d.day}</td>
                <td>{d.title}</td>
                <td>{d.description}</td>
                <td>{d.highlight}</td>
                <td>{formatCurrency(d.estimatedSpend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

