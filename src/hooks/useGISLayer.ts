import { useState, useEffect, useCallback } from 'react';
import { fetchArcGISLayer } from '../services/api/arcgis';
import { setLayerHealth, getLayerHealth } from './useLayerHealth';
import type { GeoJSONCollection } from '../types';

export function useGISLayer(layerId: string, endpoint: string, enabled: boolean) {
  const [data, setData] = useState<GeoJSONCollection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    if (data) return;

    let cancelled = false;
    setLayerHealth(layerId, { status: 'loading', error: null });

    fetchArcGISLayer(endpoint)
      .then((geojson) => {
        if (cancelled) return;
        setData(geojson);
        setError(null);
        setLayerHealth(layerId, { status: 'ok', fetchedAt: Date.now(), error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : 'Failed to load';
        setError(msg);
        const prev = getLayerHealth(layerId);
        setLayerHealth(layerId, {
          status: 'error',
          error: msg,
          retryCount: prev.retryCount + 1,
        });
      });

    return () => { cancelled = true; };
  }, [data, enabled, endpoint, layerId, retryKey]);

  const retry = useCallback(() => {
    setData(null);
    setError(null);
    setRetryKey((k) => k + 1);
  }, []);

  const loading = enabled && data === null && error === null;
  return { data, loading, error, retry };
}
