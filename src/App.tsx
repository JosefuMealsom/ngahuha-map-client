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
import { Outlet } from 'react-router-dom';
import { ButtonComponent } from './components/ButtonComponent';
import { LinkComponent } from './components/LinkComponent';

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
      <MapContainer />
      <PlantPhotosToUpload />
      <ToastContainer />
      <div data-cy="open-closest-plants" className="fixed bottom-5 left-5 z-0">
        <LinkComponent link="/closest-plants" text="Closest plants" />
      </div>
      <div data-cy="open-plant-form" className="fixed right-5 bottom-5 z-0">
        <LinkComponent link="/plant-site/new" text="New plant site" />
      </div>

      <Outlet />
    </div>
  );
}

export default App;
