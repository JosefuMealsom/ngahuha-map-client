import { useLiveQuery } from 'dexie-react-hooks';
import { MapCanvas } from './MapCanvas';
import { plantSiteTable } from '../services/offline.database';
import { MapMarker } from './MapMarker';
import { useAnimationFrame } from '../hooks/use-animation-frame.hook';
import { PanGestureHandler } from '../services/view/pan-gesture-handler.service';
import { ZoomGestureHandler } from '../services/view/zoom-gesture-handler.service';
import { useMapStore } from '../store/map.store';
import { LocationMarker } from './LocationMarker';
import { FeatureMarker } from './FeatureMarker';
import { createRef, useEffect } from 'react';

export function MapContainer() {
  const mapContainerRef = createRef<HTMLDivElement>();
  const plantSites = useLiveQuery(() => plantSiteTable.toArray());
  let panGestureHandler: PanGestureHandler;
  let zoomGestureHandler: ZoomGestureHandler;

  useAnimationFrame(() => {
    const pan = panGestureHandler.update();
    const zoom = zoomGestureHandler.update();
    useMapStore.getState().setZoom(zoom);
    useMapStore.getState().setPan(pan.x, pan.y);
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    panGestureHandler = new PanGestureHandler(mapContainerRef.current);
    zoomGestureHandler = new ZoomGestureHandler(mapContainerRef.current);
  }, []);

  return (
    <div ref={mapContainerRef}>
      <div className="relative touch-none inline-block select-none">
        <MapCanvas></MapCanvas>
        {plantSites?.map((plantSite) => (
          <MapMarker key={plantSite.id} {...plantSite}></MapMarker>
        ))}
        <LocationMarker></LocationMarker>
        <FeatureMarker
          text="The steppes"
          position={{ latitude: -35.377761, longitude: 173.966039 }}
        ></FeatureMarker>
        <FeatureMarker
          text="The avocado orchard"
          position={{ latitude: -35.377025, longitude: 173.965264 }}
        ></FeatureMarker>
      </div>
    </div>
  );
}
