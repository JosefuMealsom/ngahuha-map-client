import { useEffect, useRef } from 'react';
import { useMapStore } from '../../store/map.store';
import { interpolateToCanvasPosition } from '../../services/map-position-interpolator.service';
import { useAppStore } from '../../store/app.store';

export function LocationMarker() {
  const marker = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoom = useMapStore((state) => state.zoom);
  const pan = useMapStore((state) => state.pan);
  const { position } = useAppStore();

  useEffect(() => {
    if (!marker.current || !position || !containerRef.current) return;

    const newPosition = interpolateToCanvasPosition(
      position,
      useMapStore.getState(),
    );

    if (!newPosition) return;

    containerRef.current.classList.remove('hidden');
    containerRef.current.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
    marker.current.style.transform = `scale(${1 / zoom}, ${1 / zoom})`;
  }, [zoom, pan, position]);

  return (
    <div ref={containerRef} className="hidden top-0 left-0 absolute">
      <div
        ref={marker}
        className="w-4 h-4 bg-sky-700 rounded-full"
        data-cy="location-marker"
      ></div>
    </div>
  );
}
