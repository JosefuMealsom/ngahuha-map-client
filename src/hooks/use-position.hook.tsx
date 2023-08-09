import { useEffect, useState } from 'react';
import { LatLong } from '../types/lat-long.type';

export function usePosition() {
  const [position, setPosition] = useState<LatLong>();

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
