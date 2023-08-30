import { LoaderFunctionArgs } from 'react-router-dom';
import {
  featureUploadTable,
  featurePhotoUploadTable,
} from '../../../services/offline.database';

export const editFeatureLoader = async (loaderArgs: LoaderFunctionArgs) => {
  if (loaderArgs.params.id) {
    const featureUpload = await featureUploadTable.get(
      Number(loaderArgs.params.id),
    );

    if (!featureUpload) {
      throw Error('Feature upload not found');
    }

    const featurePhotoUploads = await featurePhotoUploadTable
      .where({
        featureUploadId: featureUpload.id,
      })
      .toArray();

    return {
      featureUpload: featureUpload,
      featurePhotoUploads: featurePhotoUploads,
    };
  }

  throw Error('Url invalid');
};
