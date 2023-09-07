import { useAppStore } from '../../store/app.store';
import { syncFeaturesOffline } from './feature/feature.service';
import {
  syncPlantSitePhotoFilesOffline,
  syncPlantSitePhotosOffline,
} from './plant-site/plant-site-photo.service';
import { syncPlantSitesOffline } from './plant-site/plant-site.service';
import { syncPlantsOffline } from './plant.service';
import {
  syncFeaturePhotoFilesOffline,
  syncFeaturePhotosOffline,
} from './feature/feature-photo.service';

export const syncDataFromServer = async () => {
  if (!navigator.onLine) return;

  const { setSyncStatus } = useAppStore.getState();

  try {
    setSyncStatus('Syncing data');
    await syncPlantsOffline();
    await syncPlantSitesOffline();
    await syncPlantSitePhotosOffline();
    await syncFeaturesOffline();
    await syncFeaturePhotosOffline();
    setSyncStatus('Syncing photos');
    await syncPlantSitePhotoFilesOffline();
    await syncFeaturePhotoFilesOffline();
    setSyncStatus('Not syncing');
  } catch (error) {
    setSyncStatus('Not syncing');
  }
};
