import { useAnimationFrame } from '../../hooks/use-animation-frame.hook';
import { PanGestureHandler } from '../../services/view/pan-gesture-handler.service';
import { ZoomGestureHandler } from '../../services/view/zoom-gesture-handler.service';
import { useMapStore } from '../../store/map.store';
import { createRef, useEffect, useState } from 'react';
import { LocationMarker } from '../MapView/LocationMarker';
import { PathCanvas } from './PathCanvas';

export function PathMapContainer() {
  const mapContainerRef = createRef<HTMLDivElement>();
  const [panGestureHandler, setPanGestureHandler] =
    useState<PanGestureHandler>();
  const [zoomGestureHandler, setZoomGestureHandler] =
    useState<ZoomGestureHandler>();

  const [animFrame, setAnimFrame] = useState(0);

  useAnimationFrame(() => setAnimFrame((previousFrame) => previousFrame + 1));

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const panHandler = new PanGestureHandler(mapContainerRef.current, 0, 0);
    const zoomHandler = new ZoomGestureHandler(mapContainerRef.current, 1);

    setPanGestureHandler(panHandler);
    setZoomGestureHandler(zoomHandler);

    return () => {
      panHandler.removeEventListeners();
      zoomHandler.removeEventListeners();
    };
  }, []);

  useEffect(() => {
    if (!panGestureHandler || !zoomGestureHandler) return;

    const pan = panGestureHandler.update();
    const zoom = zoomGestureHandler.update();

    useMapStore.getState().setZoom(zoom);
    useMapStore.getState().setPan(pan.x, pan.y);
  }, [animFrame]);

  // Need to do this in order to render the canvas in the correct position
  function resetMapCoords() {
    if (panGestureHandler) {
      panGestureHandler.removeEventListeners();
    }
    if (zoomGestureHandler) {
      zoomGestureHandler.removeEventListeners();
    }

    useMapStore.getState().setZoom(1);
    useMapStore.getState().setPan(0, 0);
    setPanGestureHandler(new PanGestureHandler(mapContainerRef.current!, 0, 0));
    setZoomGestureHandler(new ZoomGestureHandler(mapContainerRef.current!, 1));
  }

  return (
    <div
      ref={mapContainerRef}
      className="h-full top-0 left-0 overflow-hidden w-full bg-background"
    >
      <div className="h-screen">
        <div className="relative touch-none inline-block select-none overflow-hidden w-full">
          <PathCanvas onDownloadClick={resetMapCoords} />
          <LocationMarker />
        </div>
      </div>
    </div>
  );
}
