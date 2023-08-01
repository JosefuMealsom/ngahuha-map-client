import { LoaderFunctionArgs } from 'react-router-dom';
import { plantTable } from '../../services/offline.database';
import { Plant } from '../../types/api/plant.type';

export const loadPlant = async (
  loaderArgs: LoaderFunctionArgs,
): Promise<Plant> => {
  if (loaderArgs.params.id) {
    const plant = await plantTable.get(loaderArgs.params.id);
    if (!plant) {
      throw Error('Plant not found');
    }
    return plant;
  }

  throw Error('Url invalid');
};
