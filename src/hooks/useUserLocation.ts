import { useState, useCallback } from 'react';

interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setWatching(true);
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(id);
      setWatching(false);
    };
  }, []);

  // Check if user is in Frederick County (roughly)
  const isInFrederick = location
    ? location.lat >= 39.1 && location.lat <= 39.75 &&
      location.lng >= -77.8 && location.lng <= -77.0
    : false;

  return { location, error, watching, startWatching, isInFrederick };
}
