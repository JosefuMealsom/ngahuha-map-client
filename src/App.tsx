import { MapCanvas } from './components/MapCanvas';
import { PlantPhotosToUpload } from './components/PlantPhotosToUpload';
import { PlantPhotoForm } from './components/PlantPhotoForm';
import { useEffect } from 'react';
import gardenAreaService from './services/api/garden-area.service';
import genusService from './services/api/genus.service';
import speciesService from './services/api/species.service';

function App() {
  useEffect(() => {
    const syncData = async () => {
      await genusService.syncOffline();
      await gardenAreaService.syncOffline();
      await speciesService.syncOffline();
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
