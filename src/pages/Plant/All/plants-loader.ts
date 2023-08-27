import { LoaderFunctionArgs } from 'react-router-dom';
import { plantSiteTable, plantTable } from '../../../services/offline.database';
import { partition } from 'underscore';

export const loadPlants = async (loaderArgs: LoaderFunctionArgs) => {
  const plantSites = await plantSiteTable.toArray();
  const plants = await plantTable.toArray();

  const plantIdsWithPhotos = Array.from(
    new Set(plantSites.map((plantSite) => plantSite.plantId)),
  );

  const [plantsWithPhotos, _] = partition(plants, (plant) =>
    plantIdsWithPhotos.includes(plant.id),
  );

  return plantsWithPhotos;
};
