import gardenAreaService from './services/api/garden-area.service';
import { syncPlantsOffline } from './services/api/plant.service';
import { syncPlantSitesOffline } from './services/api/plant-site.service';
import {
  syncPhotoFilesOffline,
  syncPlantSitePhotosOffline,
} from './services/api/plant-site-photo.service';
import { useEffect, useState } from 'react';

export function SyncComponent() {
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (navigator.onLine) {
      syncData();
    }
  }, []);

  async function syncData() {
    setIsSyncing(true);
    await gardenAreaService.syncOffline();
    await syncPlantsOffline();
    await syncPlantSitesOffline();
    await syncPlantSitePhotosOffline();
    await syncPhotoFilesOffline();
    setIsSyncing(false);
  }

  return (
    <div
      className={`py-2 px-4 text-white text-sm font-semibold rounded-full
     bg-sky-500 transition-opacity ${isSyncing ? 'opacity-100' : 'opacity-0'}`}
    >
      Syncing data
    </div>
  );
}
