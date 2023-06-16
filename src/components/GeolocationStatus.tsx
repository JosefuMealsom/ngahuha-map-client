import { useEffect, useState } from 'react';
import { usePosition } from '../hooks/use-position.hook';

export function GeolocationStatus() {
  const [location, setGeolocation] = useState<GeolocationCoordinates>();
  usePosition(onPositionChange);

  function onPositionChange(position: GeolocationPosition) {
    setGeolocation(position.coords);
  }

  return (
    <div className="mb-4">
      <h3>Geolocation</h3>
      <p>Accuracy: {location?.accuracy}</p>
      <p>Lat: {location?.latitude}</p>
      <p>Long: {location?.longitude}</p>
    </div>
  );
}
