import { syncPlantsOffline } from './services/api/plant.service';
import { syncPlantSitesOffline } from './services/api/plant-site/plant-site.service';
import {
  syncPhotoFilesOffline as downloadPlantPhotoFiles,
  syncPlantSitePhotosOffline,
} from './services/api/plant-site/plant-site-photo.service';
import { useEffect, useState } from 'react';
import { syncFeaturesOffline } from './services/api/feature/feature.service';
import {
  syncPhotoFilesOffline as downloadFeaturePhotoFiles,
  syncFeaturePhotosOffline,
} from './services/api/feature/feature-photo.service';

export function SyncComponent() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncText, setSyncText] = useState('');

  useEffect(() => {
    if (navigator.onLine) {
      syncData();
    }
  }, []);

  async function syncData() {
    setIsSyncing(true);
    setSyncText('Syncing plants...');
    await syncPlantsOffline();
    await syncPlantSitesOffline();
    await syncPlantSitePhotosOffline();
    await syncFeaturesOffline();
    await syncFeaturePhotosOffline();
    setSyncText('Syncing photos...');
    await downloadPlantPhotoFiles();
    await downloadFeaturePhotoFiles();
    setIsSyncing(false);
  }

  return (
    <div
      className={`py-2 px-4 text-white text-sm font-semibold rounded-full
     bg-sky-500 transition-opacity ${isSyncing ? 'opacity-100' : 'opacity-0'}`}
    >
      {syncText}
    </div>
  );
}
