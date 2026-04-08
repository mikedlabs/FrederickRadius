import { useCallback } from 'react';
import { useMap } from 'react-map-gl/mapbox';

export function useMapFlyTo() {
  const { current: map } = useMap();

  const flyTo = useCallback(
    (lng: number, lat: number, zoom = 14, pitch = 50) => {
      map?.flyTo({
        center: [lng, lat],
        zoom,
        pitch,
        duration: 1200,
      });
    },
    [map]
  );

  const resetView = useCallback(() => {
    map?.flyTo({
      center: [-77.41, 39.41],
      zoom: 10,
      pitch: 45,
      bearing: -10,
      duration: 1500,
    });
  }, [map]);

  return { flyTo, resetView, map };
}
