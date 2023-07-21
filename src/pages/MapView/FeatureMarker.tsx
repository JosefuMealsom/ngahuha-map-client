import { useEffect, useRef } from 'react';
import { useMapStore } from '../../store/map.store';
import { interpolateToDomPosition } from '../../services/map-position-interpolator.service';
import { LatLong } from '../../types/lat-long.type';

export function FeatureMarker(props: { text: string; position: LatLong }) {
  const marker = useRef<HTMLDivElement>(null);
  const zoom = useMapStore((state) => state.zoom);
  const pan = useMapStore((state) => state.pan);

  useEffect(() => {
    if (!marker.current) return;

    const newPosition = interpolateToDomPosition(
      marker.current.parentElement?.clientHeight || window.innerHeight,
      props.position,
      useMapStore.getState(),
    );

    if (!newPosition) return;

    marker.current.classList.remove('hidden');
    marker.current.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
  }, [zoom, pan]);

  return (
    <div ref={marker} className="text-black top-0 left-0 absolute">
      <p className="text-xs -translate-x-1/2">{props.text}</p>
    </div>
  );
}
