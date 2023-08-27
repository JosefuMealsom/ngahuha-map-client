import { LoaderFunctionArgs } from 'react-router-dom';
import { plantSiteTable, plantTable } from '../../../services/offline.database';

export const loadPlantSite = async (loaderArgs: LoaderFunctionArgs) => {
  if (loaderArgs.params.id) {
    const plantSite = await plantSiteTable.get(loaderArgs.params.id);
    if (!plantSite) {
      throw Error('Plant site not found');
    }
    const plant = await plantTable.get(plantSite.id);
    return { plantSite: plantSite, plant: plant };
  }

  throw Error('Url invalid');
};
