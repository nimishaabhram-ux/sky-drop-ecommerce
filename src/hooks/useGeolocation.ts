import { useState, useCallback, useRef } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const requestLocation = useCallback(() => {
    setIsLocating(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        setIsLocating(false);
      },
      (err) => {
        let errorMsg = 'Failed to get location.';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMsg = 'Location permission denied. Please allow access in your browser settings.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMsg = 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            errorMsg = 'The request to get user location timed out.';
            break;
        }
        setError(errorMsg);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  return { location, error, isLocating, requestLocation };
};
