import { LoaderFunctionArgs } from 'react-router-dom';
import {
  featureTable,
  plantSiteTable,
  plantTable,
} from '../../../services/offline.database';
import { partition } from 'underscore';

export const loadPlants = async (loaderArgs: LoaderFunctionArgs) => {
  const plantSites = await plantSiteTable.toArray();
  const plants = await plantTable.toArray();
  const features = await featureTable.toArray();

  const plantIdsWithPhotos = Array.from(
    new Set(plantSites.map((plantSite) => plantSite.plantId)),
  );

  const [plantsWithPhotos, _] = partition(plants, (plant) =>
    plantIdsWithPhotos.includes(plant.id),
  );

  return { plants: plantsWithPhotos, features: features };
};
