import { MapCanvas } from './components/MapCanvas';
import { PlantPhotosToUpload } from './components/PlantPhotosToUpload';
import { PlantPhotoForm } from './components/PlantPhotoForm';
import { useEffect } from 'react';
import gardenAreaService from './services/api/garden-area.service';
import { syncPlantsOffline } from './services/api/plant.service';
import { syncPlantSitesOffline } from './services/api/plant-site.service';
import { OnlineComponent } from './components/OnlineComponent';
import { MapContainer } from './components/MapContainer';

function App() {
  useEffect(() => {
    if (navigator.onLine) {
      const syncData = async () => {
        await gardenAreaService.syncOffline();
        await syncPlantSitesOffline();
        await syncPlantsOffline();
      };
      syncData();
    }
  }, []);

  return (
    <div>
      <OnlineComponent></OnlineComponent>
      <MapContainer></MapContainer>
      <PlantPhotosToUpload></PlantPhotosToUpload>
      <PlantPhotoForm></PlantPhotoForm>
    </div>
  );
}

export default App;
