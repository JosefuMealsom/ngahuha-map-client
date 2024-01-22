import pinSvg from '../../assets/svg/map-pin.svg';
import selectedPinSvg from '../../assets/svg/map-pin-red.svg';
import { LatLong } from '../../types/lat-long.type';
import { MapElement } from './MapElement';

export function MapMarker(props: LatLong & { active: boolean }) {
  const position = {
    latitude: props.latitude,
    longitude: props.longitude,
    accuracy: props.accuracy,
  };

  return (
    <MapElement position={position} className={`${props.active ? 'z-10' : ''}`}>
      <div
        className="fill-white absolute -top-6 -left-3 h-6 w-6"
        data-cy="map-marker"
      >
        <img
          src={props.active ? selectedPinSvg : pinSvg}
          className="select-none h-full pointer-events-none origin-center"
        />
      </div>
    </MapElement>
  );
}
