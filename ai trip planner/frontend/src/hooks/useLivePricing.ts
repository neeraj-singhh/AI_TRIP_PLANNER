import { useEffect, useRef, useState } from 'react';
import { TripPayload, fetchPricing } from '../services/pricingApi';
import { useDebouncedValue } from './useDebouncedValue';

export function useLivePricing(formState: TripPayload) {
  const debounced = useDebouncedValue(formState, 700);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!debounced.departure || !debounced.destination || !debounced.startDate) {
      return;
    }

    setLoading(true);
    setError(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    fetchPricing(debounced)
      .then(res => {
        if (!controller.signal.aborted) {
          setData(res);
        }
      })
      .catch(err => {
        if (controller.signal.aborted) return;
        setError(err?.message || 'Failed to load prices');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [debounced]);

  return { data, loading, error };
}

