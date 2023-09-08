import { PlantSiteUpload } from '../../../types/api/upload/plant-site-upload.type';

export const serializeCreatePlantSite = async (
  plantSiteUpload: PlantSiteUpload,
) => {
  const plantPhotosJSON = plantSiteUpload.photos.map((photo) => ({
    blobKey: photo.blobKey,
    primaryPhoto: photo.primaryPhoto,
  }));

  return {
    accuracy: plantSiteUpload.accuracy,
    latitude: plantSiteUpload.latitude,
    longitude: plantSiteUpload.longitude,
    plantId: plantSiteUpload.plantId,
    plantSitePhotos: plantPhotosJSON,
  };
};
