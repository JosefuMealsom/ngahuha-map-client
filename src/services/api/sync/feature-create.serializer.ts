import { FeatureUpload } from '../../../types/api/upload/feature-upload.type';
import { featurePhotoUploadTable } from '../../offline.database';

export const serializeCreateFeature = async (featureUpload: FeatureUpload) => {
  const photos = await featurePhotoUploadTable
    .where({ featureUploadId: featureUpload.id })
    .toArray();

  const featurePhotosJSON = photos.map((photo) => ({
    blobKey: photo.blobKey,
  }));

  return {
    name: featureUpload.name,
    description: featureUpload.description,
    accuracy: featureUpload.accuracy,
    latitude: featureUpload.latitude,
    longitude: featureUpload.longitude,
    featurePhotos: featurePhotosJSON,
  };
};
