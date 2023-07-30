import { LoaderFunctionArgs } from 'react-router-dom';
import { plantSiteTable } from '../../services/offline.database';

export const loadPlantSite = async (loaderArgs: LoaderFunctionArgs) => {
  if (loaderArgs.params.id) {
    const plantSite = await plantSiteTable.get(loaderArgs.params.id);
    if (!plantSite) {
      throw Error('Plant site not found');
    }
    return plantSite;
  }

  throw Error('Url invalid');
};
