import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import { loadPlantSite } from './pages/PlantSite/Show/plant-site.loader';
import { PlantSiteInformation } from './pages/PlantSite/Show/ShowPlantSite';
import { NewPlantSite } from './pages/PlantSite/New/NewPlantSite';
import { EditPlantSite } from './pages/PlantSite/Edit/EditPlantSite';
import { PlantPhotosToUpload } from './pages/PendingUploads/PlantPhotosToUpload';
import { loadPlant } from './pages/Plant/Show/plant.loader';
import { ShowPlantPage } from './pages/Plant/Show/ShowPlantPage';
import { loadPlantSiteUploadWithPhotos } from './pages/PlantSite/Edit/plant-site-edit.loader';
import { NewPlantPage } from './pages/Plant/New/NewPlantPage';
import { AllPlantsPage } from './pages/Plant/All/PlantsPage';
import { MapPage } from './pages/MapView/MapPage';
import { ClosestPlantsPage } from './pages/Plant/ClosestPlants/ClosestPlantsPage';

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <MapPage />,
      },
      {
        path: 'plants',
        element: <AllPlantsPage />,
      },
      {
        path: 'plants/closest',
        element: <ClosestPlantsPage />,
      },
      {
        path: 'plants/:id',
        element: <ShowPlantPage />,
        loader: loadPlant,
      },
      {
        path: 'plants/new',
        element: <NewPlantPage />,
      },
      {
        path: 'plant-site/:id',
        element: <PlantSiteInformation />,
        loader: loadPlantSite,
      },
      {
        path: 'plant-site/:id/edit',
        element: <EditPlantSite />,
        loader: loadPlantSiteUploadWithPhotos,
      },
      {
        path: 'plant-site/new',
        element: <NewPlantSite />,
      },
      {
        path: 'plant-site/pending-upload',
        element: <PlantPhotosToUpload />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
