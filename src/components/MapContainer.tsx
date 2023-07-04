import { useLiveQuery } from 'dexie-react-hooks';
import { MapCanvas } from './MapCanvas';
import { plantSiteTable } from '../services/offline.database';
import { MapMarker } from './MapMarker';

export function MapContainer() {
  const plantSites = useLiveQuery(() => plantSiteTable.toArray());

  return (
    <div>
      <MapCanvas></MapCanvas>
      {plantSites?.map((plantSite) => (
        <MapMarker key={plantSite.id} {...plantSite}></MapMarker>
      ))}
      <></>
    </div>
  );
}
