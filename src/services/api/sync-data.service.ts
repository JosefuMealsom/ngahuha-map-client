import { useAppStore } from '../../store/app.store';
import {
  syncPlantSitePhotoFilesOffline,
  syncPlantSitePhotosOffline,
} from './plant-site/plant-site-photo.service';
import { syncPlantSitesOffline } from './plant-site/plant-site.service';
import { syncPlantsOffline } from './plant.service';

export const syncDataFromServer = async () => {
  if (!navigator.onLine) return;

  const { setSyncStatus } = useAppStore.getState();

  try {
    setSyncStatus('Syncing data');
    await syncPlantsOffline();
    await syncPlantSitesOffline();
    await syncPlantSitePhotosOffline();
    setSyncStatus('Syncing photos');
    await syncPlantSitePhotoFilesOffline();
    setSyncStatus('Not syncing');
  } catch (error) {
    setSyncStatus('Not syncing');
  }
};
