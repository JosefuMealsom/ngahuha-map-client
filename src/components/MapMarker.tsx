import { useEffect, useRef } from 'react';
import { PlantSite } from '../types/api/plant-site.type';
import { useMapStore } from '../store/map.store';
import { interpolateToCanvasPosition } from '../services/map-position-interpolator.service';
import { scale, translate, compose, applyToPoint } from 'transformation-matrix';

export function MapMarker(props: PlantSite) {
  const pan = useMapStore((state) => state.pan);
  const zoom = useMapStore((state) => state.zoom);
  const marker = useRef<HTMLDivElement>(null);
  const canvasDimensions = useMapStore((state) => state.canvasDimensions);
  const mapBounds = useMapStore((state) => state.mapBounds);
  const position = { latitude: props.latitude, longitude: props.longitude };

  useEffect(() => {
    const interpolatedPosition = interpolateToCanvasPosition(
      mapBounds,
      position,
      canvasDimensions,
    );
    if (!interpolatedPosition) return;
    if (!marker.current) return;

    const height = marker.current.parentElement?.clientHeight;
    const canvasToDomRatio =
      (height || window.innerHeight) / canvasDimensions.height;

    const x = interpolatedPosition.x;
    const y = interpolatedPosition.y;

    const { width: cw, height: ch } = canvasDimensions;
    const offsetWidth = (cw / 2) * zoom - cw / 2;
    const offsetHeight = (ch / 2) * zoom - ch / 2;

    const transformationMatrix = compose(
      scale(zoom, zoom),
      scale(canvasToDomRatio, canvasToDomRatio),
      translate(-5 / zoom, -5 / zoom),
      translate(-offsetWidth / zoom, -offsetHeight / zoom),
      translate(pan.x / zoom, pan.y / zoom),
      translate(interpolatedPosition.x, interpolatedPosition.y),
    );

    const newPosition = applyToPoint(transformationMatrix, { x: 0, y: 0 });

    marker.current.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
  });

  return (
    <div
      ref={marker}
      className="w-2 h-2 bg-purple-500 absolute top-0 left-0 rounded-full opacity-60"
    ></div>
  );
}
