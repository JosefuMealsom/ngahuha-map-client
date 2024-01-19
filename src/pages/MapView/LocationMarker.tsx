import { useContext, useRef } from 'react';
import { useMapStore } from '../../store/map.store';
import { interpolateToCanvasPosition } from '../../services/map-position-interpolator.service';
import { useAppStore } from '../../store/app.store';
import { PanZoomContext } from '../../components/PanZoomComponent';
import { useAnimationFrame } from '../../hooks/use-animation-frame.hook';

export function LocationMarker() {
  const marker = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { position } = useAppStore();

  const panZoomContext = useContext(PanZoomContext);

  useAnimationFrame(() => {
    if (!marker.current || !position || !containerRef.current) return;

    const newPosition = interpolateToCanvasPosition(
      position,
      useMapStore.getState(),
    );

    if (!newPosition) return;

    containerRef.current.classList.remove('hidden');
    containerRef.current.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;

    const zoom = panZoomContext?.zoom;

    if (zoom) {
      marker.current.style.transform = `scale(${1 / zoom}, ${1 / zoom})`;
    }
  }, [panZoomContext]);

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
