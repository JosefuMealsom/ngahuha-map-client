import { LoaderFunctionArgs } from 'react-router-dom';
import {
  plantSiteUploadTable,
  plantTable,
} from '../../../services/offline.database';

const loadPlant = async (plantId?: string) => {
  if (!plantId) return;

  return plantTable.get(plantId);
};

export const loadPlantSiteUploadWithPhotos = async (
  loaderArgs: LoaderFunctionArgs,
) => {
  if (loaderArgs.params.id) {
    const plantSiteUpload = await plantSiteUploadTable.get(
      Number(loaderArgs.params.id),
    );

    if (!plantSiteUpload) {
      throw Error('Plant site not found');
    }

    const plant = await loadPlant(plantSiteUpload.plantId);

    return {
      plantSiteUpload: plantSiteUpload,
      plant: plant,
    };
  }

  throw Error('Url invalid');
};
