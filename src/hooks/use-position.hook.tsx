import { useEffect, useState } from 'react';

export function usePosition() {
  const [position, setPosition] = useState<GeolocationCoordinates>();

  useEffect(() => {
    const handlerId = navigator.geolocation.watchPosition(
      (position) => {
        setPosition(position.coords);
      },
      null,
      {
        enableHighAccuracy: true,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(handlerId);
    };
  }, []);

  return position;
}
