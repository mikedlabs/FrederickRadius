import { useState, useEffect } from 'react';
import { fetchArcGISLayer } from '../services/api/arcgis';
import type { GeoJSONCollection } from '../types';

export function useGISLayer(endpoint: string, enabled: boolean) {
  const [data, setData] = useState<GeoJSONCollection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (data) return; // Already loaded — ArcGIS cache handles freshness

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchArcGISLayer(endpoint)
      .then((geojson) => {
        if (!cancelled) setData(geojson);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [endpoint, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}
