import { useEffect, useRef, useState } from 'react';
import { useMapStore } from '../store/map.store';
import {
  interpolateToCanvasPosition,
  interpolateToDomPosition,
} from '../services/map-position-interpolator.service';
import { scale, translate, compose, applyToPoint } from 'transformation-matrix';
import { usePosition } from '../hooks/use-position.hook';
import { LatLong } from '../types/lat-long.type';
import { useAnimationFrame } from '../hooks/use-animation-frame.hook';

export function LocationMarker() {
  const marker = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<LatLong>();
  const zoom = useMapStore((state) => state.zoom);
  const pan = useMapStore((state) => state.pan);

  usePosition((position) => {
    setPosition(position.coords);
  });

  useEffect(() => {
    if (!marker.current || !position) return;

    const newPosition = interpolateToDomPosition(
      marker.current.parentElement?.clientHeight || window.innerHeight,
      position,
      useMapStore.getState(),
    );

    if (!newPosition) return;

    marker.current.classList.remove('hidden');
    marker.current.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
  }, [zoom, pan, position]);

  return (
    <div
      ref={marker}
      className="w-4 h-4 bg-sky-700 top-0 left-0 absolute hidden rounded-full"
    ></div>
  );
}
