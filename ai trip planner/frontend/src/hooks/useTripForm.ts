import { useState } from 'react';

export function useTripForm() {
  const [state, setState] = useState({
    departure: '',
    destination: '',
    startDate: '',
    endDate: '',
    numPeople: 2,
    category: 'budget',
    preferredTransport: 'flight'
  });

  function update<K extends keyof typeof state>(key: K, value: (typeof state)[K]) {
    setState(prev => ({ ...prev, [key]: value }));
  }

  return { state, update };
}

