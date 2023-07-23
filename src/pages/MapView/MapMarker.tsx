import { useRef } from 'react';
import { PlantSite } from '../../types/api/plant-site.type';
import { interpolateToDomPosition } from '../../services/map-position-interpolator.service';

import pinSvg from '../../assets/svg/map-pin.svg';
import { useMapStore } from '../../store/map.store';
import { useAnimationFrame } from '../../hooks/use-animation-frame.hook';

export function MapMarker(props: PlantSite) {
  const marker = useRef<HTMLDivElement>(null);
  const position = { latitude: props.latitude, longitude: props.longitude };

  useAnimationFrame(() => {
    if (!marker.current) return;

    const newPosition = interpolateToDomPosition(
      marker.current.parentElement?.clientHeight || window.innerHeight,
      position,
      useMapStore.getState(),
    );

    if (!newPosition) return;

    marker.current.classList.remove('hidden');
    marker.current.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
  });

  return (
    <div
      id={props.id}
      ref={marker}
      className="w-9 fill-white absolute -top-4 -left-2 rounded-full hidden will-change-transform"
      data-cy="map-marker"
    >
      <img src={pinSvg} className="select-none pointer-events-none" />
    </div>
  );
}
