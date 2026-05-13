import React from 'react';

interface Props {
  value: {
    departure: string;
    destination: string;
    startDate: string;
    endDate?: string;
    numPeople: number;
    category: string;
    preferredTransport?: string;
  };
  onChange: <K extends keyof Props['value']>(key: K, val: Props['value'][K]) => void;
}

const cities = [
  'New Delhi',
  'Varanasi',
  'Goa',
  'Mumbai',
  'Haridwar',
  'Sikkim',
  'Valley Of Flowers'
];

export const TripForm: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="form-grid">
      <div className="form-field">
        <label>Departure</label>
        <select
          value={value.departure}
          onChange={e => onChange('departure', e.target.value)}
        >
          <option value="">Choose departure</option>
          {cities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Destination</label>
        <select
          value={value.destination}
          onChange={e => onChange('destination', e.target.value)}
        >
          <option value="">Choose destination</option>
          {cities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Trip Category</label>
        <select
          value={value.category}
          onChange={e => onChange('category', e.target.value)}
        >
          <option value="budget">Budget Friendly</option>
          <option value="friends">Friends</option>
          <option value="family">Family</option>
          <option value="group">Group Travel</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>

      <div className="form-field">
        <label>Timeline</label>
        <input
          type="datetime-local"
          value={value.startDate}
          onChange={e => onChange('startDate', e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Means of Transport</label>
        <select
          value={value.preferredTransport}
          onChange={e => onChange('preferredTransport', e.target.value)}
        >
          <option value="flight">Flight</option>
          <option value="train">Train</option>
          <option value="bus">Bus</option>
          <option value="car">Car</option>
        </select>
      </div>

      <div className="form-field">
        <label>Number of People</label>
        <input
          type="number"
          min={1}
          value={value.numPeople}
          onChange={e => onChange('numPeople', Number(e.target.value))}
        />
      </div>
    </div>
  );
};

