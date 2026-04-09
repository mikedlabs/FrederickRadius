import { useState, useEffect } from 'react';
import { fetchMunicipalityBoundaries } from '../services/api/census';
import type { GeoJSONCollection } from '../types';

export function useMunicipalityBoundaries() {
  const [boundaries, setBoundaries] = useState<GeoJSONCollection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchMunicipalityBoundaries()
      .then((data) => {
        setBoundaries(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load boundaries');
      })
      .finally(() => setLoading(false));
  }, []);

  return { boundaries, loading, error };
}
