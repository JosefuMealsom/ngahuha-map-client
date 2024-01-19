import { ReactNode, useEffect, useRef } from 'react';
import { interpolateToCanvasPosition } from '../../services/map-position-interpolator.service';
import { useMapStore } from '../../store/map.store';
import { LatLong } from '../../types/lat-long.type';
import { PanZoomNormaliseScaleComponent } from '../../components/PanZoomNormaliseScaleComponent';

export function MapElement(props: { position?: LatLong; children: ReactNode }) {
  const marker = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marker.current || !props.position) return;

    const newPosition = interpolateToCanvasPosition(
      props.position,
      useMapStore.getState(),
    );

    if (!newPosition) return;

    marker.current.classList.remove('hidden');
    marker.current.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
  }, [props.position]);

  return (
    <div className="absolute top-0 left-0 hidden" ref={marker}>
      <PanZoomNormaliseScaleComponent>
        {props.children}
      </PanZoomNormaliseScaleComponent>
    </div>
  );
}
