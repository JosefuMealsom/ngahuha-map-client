import { useAppStore } from '../../store/app.store';
import { MapElement } from './MapElement';

export function LocationMarker() {
  const { position } = useAppStore();

  return (
    <MapElement position={position}>
      <div
        className="w-4 h-4 bg-sky-700 rounded-full"
        data-cy="location-marker"
      ></div>
    </MapElement>
  );
}
