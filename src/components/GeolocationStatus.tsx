import { useEffect, useState } from 'react';

export function GeolocationStatus() {
  const [location, setGeolocation] = useState<GeolocationCoordinates>();

  const onPositionChange = (position: GeolocationPosition) => {
    setGeolocation(position.coords);
  };

  // Really inefficient to be adding and removing handlers so frequently
  useEffect(() => {
    const handlerId = navigator.geolocation.watchPosition(onPositionChange);

    return () => {
      navigator.geolocation.clearWatch(handlerId);
    };
  });

  return (
    <div className="mb-4">
      <h3>Geolocation</h3>
      <p>Accuracy: {location?.accuracy}</p>
      <p>Lat: {location?.latitude}</p>
      <p>Long: {location?.longitude}</p>
    </div>
  );
}
