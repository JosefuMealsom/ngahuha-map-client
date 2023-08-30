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
import { LoginPage } from './pages/Login/LoginPage';
import {} from './pages/Login/LoginPage';
import { ProtectedRoute } from './pages/ProtectedRoute';
import { readUserStateFromCookie } from './services/user.service';
import { loadPlants } from './pages/Plant/All/plants-loader';
import { NewFeaturePage } from './pages/Feature/NewFeaturePage';
import { EditFeaturePage } from './pages/Feature/Edit/EditFeaturePage';
import { editFeatureLoader } from './pages/Feature/Edit/edit-feature.loader';

readUserStateFromCookie();

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
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: 'plants',
        loader: loadPlants,
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
        element: (
          <ProtectedRoute>
            <NewPlantPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'plant-site/:id',
        element: <PlantSiteInformation />,
        loader: loadPlantSite,
      },
      {
        path: 'plant-site/:id/edit',
        element: (
          <ProtectedRoute>
            <EditPlantSite />
          </ProtectedRoute>
        ),
        loader: loadPlantSiteUploadWithPhotos,
      },
      {
        path: 'plant-site/new',
        element: (
          <ProtectedRoute>
            <NewPlantSite />
          </ProtectedRoute>
        ),
      },
      {
        path: 'plant-site/pending-upload',
        element: (
          <ProtectedRoute>
            <PlantPhotosToUpload />
          </ProtectedRoute>
        ),
      },
      {
        path: 'feature/new',
        element: (
          <ProtectedRoute>
            <NewFeaturePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'feature/:id/edit',
        loader: editFeatureLoader,
        element: (
          <ProtectedRoute>
            <EditFeaturePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
