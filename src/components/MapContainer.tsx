import { useLiveQuery } from 'dexie-react-hooks';
import { MapCanvas } from './MapCanvas';
import { plantSiteTable } from '../services/offline.database';
import { MapMarker } from './MapMarker';
import { useAnimationFrame } from '../hooks/use-animation-frame.hook';
import { PanGestureHandler } from '../services/view/pan-gesture-handler.service';
import { ZoomGestureHandler } from '../services/view/zoom-gesture-handler.service';
import { useMapStore } from '../store/map.store';

export function MapContainer() {
  const plantSites = useLiveQuery(() => plantSiteTable.toArray());
  const panGestureHandler = new PanGestureHandler(document.body);
  const zoomGestureHandler = new ZoomGestureHandler(document.body);

  useAnimationFrame(() => {
    const pan = panGestureHandler.update();
    const zoom = zoomGestureHandler.update();
    useMapStore.getState().setZoom(zoom);
    useMapStore.getState().setPan(pan.x, pan.y);
  });

  return (
    <div>
      <div className="relative touch-none inline-block">
        <MapCanvas></MapCanvas>
        {plantSites?.map((plantSite) => (
          <MapMarker key={plantSite.id} {...plantSite}></MapMarker>
        ))}
      </div>
    </div>
  );
}
