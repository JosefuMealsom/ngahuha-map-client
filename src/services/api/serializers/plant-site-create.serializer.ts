import { PlantSiteUpload } from '../../../types/api/upload/plant-site-upload.type';
import { plantSitePhotoUploadTable } from '../../offline.database';

export const serializeCreatePlantSite = async (
  plantSiteUpload: PlantSiteUpload,
) => {
  const photos = await plantSitePhotoUploadTable
    .where({ plantSiteUploadId: plantSiteUpload.id })
    .toArray();

  const plantPhotosJSON = photos.map((photo) => ({
    blobKey: photo.blobKey,
  }));

  return {
    accuracy: plantSiteUpload.accuracy,
    latitude: plantSiteUpload.latitude,
    longitude: plantSiteUpload.longitude,
    plantSitePhotos: plantPhotosJSON,
  };
};
