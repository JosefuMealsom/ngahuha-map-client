import { MapCanvas } from './MapCanvas';
import { useAnimationFrame } from '../../hooks/use-animation-frame.hook';
import { PanGestureHandler } from '../../services/view/pan-gesture-handler.service';
import { ZoomGestureHandler } from '../../services/view/zoom-gesture-handler.service';
import { useMapStore } from '../../store/map.store';
import { LocationMarker } from './LocationMarker';
import { FeatureMarker } from './FeatureMarker';
import { createRef, useEffect } from 'react';
import { MapFilter } from './MapFilter';

export function MapContainer() {
  const mapContainerRef = createRef<HTMLDivElement>();

  let panGestureHandler: PanGestureHandler;
  let zoomGestureHandler: ZoomGestureHandler;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    panGestureHandler = new PanGestureHandler(mapContainerRef.current);
    zoomGestureHandler = new ZoomGestureHandler(mapContainerRef.current);
  }, []);

  useAnimationFrame(() => {
    const pan = panGestureHandler.update();
    const zoom = zoomGestureHandler.update();
    useMapStore.getState().setZoom(zoom);
    useMapStore.getState().setPan(pan.x, pan.y);
  });

  return (
    <div ref={mapContainerRef} className="h-screen overflow-hidden w-full">
      <div className="relative touch-none inline-block select-none overflow-hidden">
        <MapCanvas />
        <LocationMarker />
        <FeatureMarker
          text="The steppes"
          position={{ latitude: -35.377761, longitude: 173.966039 }}
        />
        <FeatureMarker
          text="The avocado orchard"
          position={{ latitude: -35.377025, longitude: 173.965264 }}
        />
        <MapFilter />
      </div>
    </div>
  );
}
