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

  const mapStore = useMapStore();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    panGestureHandler = new PanGestureHandler(
      mapContainerRef.current,
      mapStore.pan.x,
      mapStore.pan.y,
    );
    zoomGestureHandler = new ZoomGestureHandler(
      mapContainerRef.current,
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

  return (
    <div
      ref={mapContainerRef}
      className="h-full fixed top-0 left-0 overflow-hidden w-full"
    >
      <div className="relative touch-none inline-block select-none overflow-hidden w-full">
        <MapCanvas />
        <FeatureMarker
          text="The steppes"
          position={{
            latitude: -35.377761,
            longitude: 173.966039,
            accuracy: 0,
          }}
        />
        <FeatureMarker
          text="The avocado orchard"
          position={{
            latitude: -35.377025,
            longitude: 173.965264,
            accuracy: 0,
          }}
        />
        <LocationMarker />
        <MapFilter />
      </div>
    </div>
  );
}
