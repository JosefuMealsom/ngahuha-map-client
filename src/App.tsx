import { MapCanvas } from './components/MapCanvas';
import { PlantPhotosToUpload } from './components/PlantPhotosToUpload';
import { PlantPhotoForm } from './components/PlantPhotoForm';
import { useEffect } from 'react';
import gardenAreaService from './services/api/garden-area.service';
import { syncPlantsOffline } from './services/api/plant.service';
import { syncPlantSitesOffline } from './services/api/plant-site.service';
import { MapContainer } from './components/MapContainer';
import { ClosestPlantsToUser } from './components/ClosestPlantsToUser';
import { syncPlantSitePhotosOffline } from './services/api/plant-site-photo.service';

function App() {
  useEffect(() => {
    if (navigator.onLine) {
      const syncData = async () => {
        await gardenAreaService.syncOffline();
        await syncPlantsOffline();
        await syncPlantSitesOffline();
        await syncPlantSitePhotosOffline();
      };
      syncData();
    }
  }, []);

  return (
    <div>
      <MapContainer></MapContainer>
      <PlantPhotosToUpload></PlantPhotosToUpload>
      <PlantPhotoForm></PlantPhotoForm>
      <ClosestPlantsToUser></ClosestPlantsToUser>
    </div>
  );
}

export default App;
