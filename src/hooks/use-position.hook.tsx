import { useEffect } from 'react';

export function usePosition(onPositionChange: PositionCallback) {
  useEffect(() => {
    const handlerId = navigator.geolocation.watchPosition(
      onPositionChange,
      null,
      {
        enableHighAccuracy: true,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(handlerId);
    };
  }, []);
}
