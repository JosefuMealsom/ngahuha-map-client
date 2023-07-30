import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import { ClosestPlantsToUser } from './pages/ClosestPlants/ClosestPlantsToUser';
import { loadPlantSite } from './pages/PlantSiteInformation/plant-site.loader';
import { PlantSiteInformation } from './pages/PlantSiteInformation/PlantSiteInformation';
import { PlantPhotoForm } from './pages/NewPlantSite/PlantPhotoForm';
import { PlantPhotosToUpload } from './pages/PendingUploads/PlantPhotosToUpload';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'closest-plants',
        element: <ClosestPlantsToUser />,
      },
      {
        path: 'plant-site/:id',
        element: <PlantSiteInformation />,
        loader: loadPlantSite,
      },
      {
        path: 'plant-site/new',
        element: <PlantPhotoForm />,
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
