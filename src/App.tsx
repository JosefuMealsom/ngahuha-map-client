import { MapCanvas } from './components/MapCanvas';
import { PlantPhotosToUpload } from './components/PlantPhotosToUpload';
import { PlantPhotoForm } from './components/PlantPhotoForm';
import { useEffect } from 'react';
import gardenAreaService from './services/api/garden-area.service';
import { syncPlantsOffline } from './services/api/plant.service';
import { syncPlantSitesOffline } from './services/api/plant-site.service';

function App() {
  useEffect(() => {
    const syncData = async () => {
      await gardenAreaService.syncOffline();
      await syncPlantSitesOffline();
      await syncPlantsOffline();
    };
    syncData();
  }, []);

  return (
    <div className="touch-pan-y">
      <MapCanvas></MapCanvas>
      <PlantPhotosToUpload></PlantPhotosToUpload>
      <PlantPhotoForm></PlantPhotoForm>
    </div>
  );
}

export default App;
