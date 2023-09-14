import { useEffect, useRef } from 'react';
import mapUrl from '../../assets/svg/ngahuha-2.svg';
import { useAnimationFrame } from '../../hooks/use-animation-frame.hook';
import { useMapStore } from '../../store/map.store';

import { PanGestureHandler } from '../../services/view/pan-gesture-handler.service';
import { ZoomGestureHandler } from '../../services/view/zoom-gesture-handler.service';
import { compose, scale, toCSS, translate } from 'transformation-matrix';

export function MapSvg() {
  const svgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  let panGestureHandler: PanGestureHandler;
  let zoomGestureHandler: ZoomGestureHandler;

  const mapStore = useMapStore();

  useEffect(() => {
    if (!containerRef.current) return;

    panGestureHandler = new PanGestureHandler(
      containerRef.current,
      mapStore.pan.x,
      mapStore.pan.y,
    );
    zoomGestureHandler = new ZoomGestureHandler(
      containerRef.current,
      mapStore.zoom,
    );

    return () => {
      panGestureHandler.removeEventListeners();
      zoomGestureHandler.removeEventListeners();
    };
  }, []);

  useAnimationFrame(() => {
    const pan = panGestureHandler.update();
    const zoom = zoomGestureHandler.update();
    useMapStore.getState().setZoom(zoom);
    useMapStore.getState().setPan(pan.x, pan.y);
  });

  useAnimationFrame(() => {
    if (!svgRef.current || !containerRef.current) return;

    const { height } = useMapStore.getState().canvasDimensions;
    const svgToDomRatio = containerRef.current.clientHeight / height;
    const { x, y } = useMapStore.getState().pan;
    const zoom = useMapStore.getState().zoom;

    const mapTransformation = compose(
      scale(svgToDomRatio, svgToDomRatio),
      translate(x, y),
      scale(zoom, zoom),
    );

    const cssTransform = toCSS(mapTransformation);

    svgRef.current.style.transform = cssTransform;
  });

  return (
    <div
      ref={containerRef}
      draggable={false}
      className="touch-none bg-[#96AF98] h-screen w-max sm:w-screen"
    >
      <img
        draggable={false}
        ref={svgRef}
        src={mapUrl}
        className="h-screen pointer-events-none"
      />
    </div>
  );
}
