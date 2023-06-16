import { useEffect } from 'react';

export function usePosition(onPositionChange: PositionCallback) {
  useEffect(() => {
    const handlerId = navigator.geolocation.watchPosition(onPositionChange);

    return () => {
      navigator.geolocation.clearWatch(handlerId);
    };
  }, []);
}
