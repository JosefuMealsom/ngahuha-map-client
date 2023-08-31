import { fetchBlobUploadUrl, uploadBlob } from '../sync/blob-uploader.service';
import {
  featurePhotoUploadTable,
  featureUploadTable,
} from '../../offline.database';
import axiosClient from '../../axios/axios-client';
import {
  FeaturePhotoUpload,
  FeatureUpload,
} from '../../../types/api/upload/feature-upload.type';
import { serializeCreateFeature } from './feature-create.serializer';

export const bulkUploadFeaturesToServer = async (
  featureUploads: FeatureUpload[],
) => {
  for (const upload of featureUploads) {
    await uploadFeatureToServer(upload);
  }
};

export const uploadFeatureToServer = async (featureUpload: FeatureUpload) => {
  const featurePhotos = await featurePhotoUploadTable
    .where({ featureUploadId: featureUpload.id })
    .toArray();

  await uploadPhotoBlobs(featurePhotos);
  await uploadFeature(featureUpload);
  await clearFeatureUpload(featureUpload, featurePhotos);
};

const uploadPhotoBlobs = async (featurePhotoUploads: FeaturePhotoUpload[]) => {
  return Promise.all(
    featurePhotoUploads.map(async (photo) => {
      // On server upload failure, don't upload blob again
      if (photo.blobKey) {
        return photo;
      }

      const { url, blobKey } = await fetchBlobUploadUrl();
      await uploadBlob(url, photo.data);

      await featurePhotoUploadTable.put({ blobKey: blobKey, ...photo });
    }),
  );
};

const uploadFeature = async (featureUpload: FeatureUpload) => {
  const createJSON = await serializeCreateFeature(featureUpload);

  return axiosClient.post('feature', createJSON);
};

const clearFeatureUpload = async (
  featureUpload: FeatureUpload,
  featurePhotoUploads: FeaturePhotoUpload[],
) => {
  await featurePhotoUploadTable.bulkDelete(
    featurePhotoUploads.map(({ id }) => id as number),
  );
  await featureUploadTable.delete(featureUpload.id as number);
};
