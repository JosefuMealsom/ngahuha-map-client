import { PlantSiteUpload } from '../../../types/api/upload/plant-site-upload.type';
import { gardenAreaTable } from '../../offline.database';

class GardenAreaMissingError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const serializeCreatePlantSite = async (
  plantSiteUpload: PlantSiteUpload,
) => {
  const plantPhotosJSON = plantSiteUpload.photos.map((photo) => ({
    blobKey: photo.blobKey,
  }));

  const gardenArea = await getGardenArea();

  return {
    accuracy: plantSiteUpload.accuracy,
    latitude: plantSiteUpload.latitude,
    longitude: plantSiteUpload.longitude,
    plantId: plantSiteUpload.plantId,
    plantSitePhotos: plantPhotosJSON,
    gardenAreaId: gardenArea.id,
  };
};

const getGardenArea = async () => {
  const gardenArea = await gardenAreaTable.where({ name: 'Other' }).first();
  if (!gardenArea) {
    throw new GardenAreaMissingError(
      "Serialization failed: Garden area 'Other' not found",
    );
  }
  return gardenArea;
};
