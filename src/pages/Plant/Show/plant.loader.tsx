import { LoaderFunctionArgs } from 'react-router-dom';
import { plantSiteTable, plantTable } from '../../../services/offline.database';
import { Plant } from '../../../types/api/plant.type';

export const loadPlant = async (loaderArgs: LoaderFunctionArgs) => {
  if (loaderArgs.params.id) {
    const plant = await plantTable.get(loaderArgs.params.id);
    const plantSites = await plantSiteTable
      .where({ plantId: plant?.id })
      .toArray();
    if (!plant) {
      throw Error('Plant not found');
    }
    return { plant: plant, plantSites: plantSites };
  }

  throw Error('Url invalid');
};
