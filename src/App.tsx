import { PlantPhotosToUpload } from './pages/PendingUploads/PlantPhotosToUpload';
import { PlantPhotoForm } from './pages/NewPlantSite/PlantPhotoForm';
import gardenAreaService from './services/api/garden-area.service';
import { syncPlantsOffline } from './services/api/plant.service';
import { syncPlantSitesOffline } from './services/api/plant-site.service';
import { MapContainer } from './pages/MapView/MapContainer';
import { ClosestPlantsToUser } from './pages/ClosestPlants/ClosestPlantsToUser';
import { syncPlantSitePhotosOffline } from './services/api/plant-site-photo.service';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

if (navigator.onLine) {
  const syncData = async () => {
    await gardenAreaService.syncOffline();
    await syncPlantsOffline();
    await syncPlantSitesOffline();
    await syncPlantSitePhotosOffline();
  };
  syncData();
}

function App() {
  return (
    <div>
      <div className="bg-black bg-opacity-50 pt-safe fixed top-0 left-0 z-30 w-full"></div>
      <MapContainer />
      <PlantPhotosToUpload />
      <PlantPhotoForm />
      <ClosestPlantsToUser />
      <ToastContainer />
    </div>
  );
}

export default App;
