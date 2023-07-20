import { useEffect, useRef, useState } from 'react';
import { PlantSite } from '../types/api/plant-site.type';
import { interpolateToDomPosition } from '../services/map-position-interpolator.service';

import pinSvg from '../assets/svg/map-pin.svg';
import { useMapStore } from '../store/map.store';
import { getFullPlantName } from '../utils/plant-name-decorator.util';
import { plantTable } from '../services/offline.database';

export function MapMarker(props: PlantSite) {
  const marker = useRef<HTMLDivElement>(null);
  const infoWindow = useRef<HTMLDivElement>(null);
  const position = { latitude: props.latitude, longitude: props.longitude };
  const zoom = useMapStore((state) => state.zoom);
  const pan = useMapStore((state) => state.pan);
  const [plantName, setPlantName] = useState('');

  useEffect(() => {
    if (!marker.current) return;

    const newPosition = interpolateToDomPosition(
      marker.current.parentElement?.clientHeight || window.innerHeight,
      position,
      useMapStore.getState(),
    );

    if (!newPosition) return;

    marker.current.classList.remove('hidden');
    marker.current.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
  }, [zoom, pan]);

  return (
    <div
      id={props.id}
      ref={marker}
      className="w-9 fill-white absolute -top-4 -left-2 rounded-full hidden"
    >
      <img src={pinSvg} className="select-none pointer-events-none" />
    </div>
  );
}
