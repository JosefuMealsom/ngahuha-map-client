import { useCallback, useEffect, useRef, useState } from 'react';
import mapUrl from '../../assets/svg/ngahuha-3.svg';
import { useAnimationFrame } from '../../hooks/use-animation-frame.hook';
import { useMapStore } from '../../store/map.store';
import { PanGestureHandler } from '../../services/view/pan-gesture-handler.service';
import { ZoomGestureHandler } from '../../services/view/zoom-gesture-handler.service';
import {
  applyToPoint,
  compose,
  scale,
  toCSS,
  translate,
} from 'transformation-matrix';
import { PlantSite } from '../../types/api/plant-site.type';
import { MapMarker } from './MapMarker';
import { interpolateToCanvasPosition } from '../../services/map-position-interpolator.service';
import { LocationMarker } from './LocationMarker';

export function MapSvg(props: {
  plantSites: PlantSite[];
  selectedPlantSiteId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gestureHandlerContainerRef = useRef<HTMLDivElement>(null);
  const { setPan, setZoom } = useMapStore();

  const [panGestureHandler, setPanGestureHandler] =
    useState<PanGestureHandler>();
  const [zoomGestureHandler, setZoomGestureHandler] =
    useState<ZoomGestureHandler>();

  const mapStore = useMapStore();

  useEffect(() => {
    if (!gestureHandlerContainerRef.current) return;

    const panBounds = { x: { min: -600, max: 50 }, y: { min: -910, max: 50 } };

    const panHandler = new PanGestureHandler(
      gestureHandlerContainerRef.current,
      mapStore.pan.x,
      mapStore.pan.y,
      panBounds,
    );

    setPanGestureHandler(panHandler);

    const zoomHandler = new ZoomGestureHandler(
      gestureHandlerContainerRef.current,
      mapStore.zoom,
    );

    setZoomGestureHandler(zoomHandler);

    return () => {
      panHandler.removeEventListeners();
      zoomHandler.removeEventListeners();
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const marker = props.plantSites.find(
      (plantSite) => plantSite.id === props.selectedPlantSiteId,
    );

    const { x, y } = interpolateToCanvasPosition(
      { ...marker! },
      useMapStore.getState(),
    )!;

    const position = applyToPoint(translate(-x, -y), { x: 0, y: 0 });

    if (position) {
      panGestureHandler?.setPan(position.x, position.y);
      setPan(position.x, position.y);
    }
  }, [props.selectedPlantSiteId]);

  const onAnimationCallback = useCallback(() => {
    if (!panGestureHandler || !zoomGestureHandler) return;

    const pan = panGestureHandler.update();
    setPan(pan.x, pan.y);
    const zoom = zoomGestureHandler.update();
    setZoom(zoom);

    const mapTransformation = compose(
      translate(window.innerWidth / 2, window.innerHeight / 2),
      scale(zoom, zoom),
      translate(pan.x, pan.y),
    );

    const cssTransform = toCSS(mapTransformation);

    if (containerRef.current)
      containerRef.current.style.transform = cssTransform;
  }, [panGestureHandler, zoomGestureHandler]);

  useAnimationFrame(onAnimationCallback, [
    panGestureHandler,
    zoomGestureHandler,
  ]);

  return (
    <div
      draggable={false}
      className="touch-none bg-[#96AF98] h-screen w-screen relative"
      ref={gestureHandlerContainerRef}
    >
      <div
        ref={containerRef}
        className="origin-top-left relative min-w-[640px]"
      >
        <img draggable={false} src={mapUrl} className="pointer-events-none" />
        {props.plantSites.map((plantSite) => (
          <MapMarker
            key={plantSite.id}
            {...plantSite}
            active={props.selectedPlantSiteId === plantSite.id}
          />
        ))}
        <LocationMarker />
      </div>
    </div>
  );
}
