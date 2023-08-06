import gardenAreaService from './services/api/garden-area.service';
import { syncPlantsOffline } from './services/api/plant.service';
import { syncPlantSitesOffline } from './services/api/plant-site.service';
import { MapContainer } from './pages/MapView/MapContainer';
import { syncPlantSitePhotosOffline } from './services/api/plant-site-photo.service';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';
import { LinkComponent } from './components/LinkComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteUploadTable } from './services/offline.database';

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
  const plantUploadCount = useLiveQuery(() => plantSiteUploadTable.count());

  function renderPendingUploadLink() {
    if (plantUploadCount === 0) return;

    return (
      <div data-cy="open-upload-form">
        <LinkComponent
          link="/plant-site/pending-upload"
          text="Pending upload"
        />
      </div>
    );
  }

  return (
    <div>
      <MapContainer />
      <nav className="fixed bottom-5 left-0 w-full flex justify-evenly">
        {renderPendingUploadLink()}
        <div data-cy="open-closest-plants">
          <LinkComponent link="/closest-plants" text="Closest plants" />
        </div>
        <div data-cy="open-plant-list">
          <LinkComponent link="/plants" text="All plants" />
        </div>
        <div data-cy="open-plant-form">
          <LinkComponent link="/plant-site/new" text="New plant site" />
        </div>
      </nav>

      <Outlet />
      <ToastContainer />
    </div>
  );
}

export default App;
