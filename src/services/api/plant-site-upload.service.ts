import { plantSiteUploadTable, plantTable } from '../offline.database';

class PlantIdMissingError extends Error {
  constructor(plantId: string) {
    super(`Plant with id: '${plantId}' not found`);
    this.name = 'PlantIdMissingError';
  }
}

export const addPlantSiteWithPhoto = async (
  photoBlobs: Blob | Blob[],
  location: GeolocationCoordinates,
  plantId?: string,
) => {
  //convert to array if only 1 photo passed as a parameter
  const photos = await Promise.all(
    [photoBlobs].flat().map(async (blob) => blob.arrayBuffer()),
  );

  if (plantId) {
    await validatePlantExists(plantId);
  }

  return addPlantSiteUpload(location, photos, plantId);
};

export const deletePlantSite = async (id: number) => {
  return plantSiteUploadTable.delete(id);
};

const validatePlantExists = async (plantId: string) => {
  const plant = await plantTable.get(plantId);

  if (!plant) {
    throw new PlantIdMissingError(plantId);
  }
};

const addPlantSiteUpload = (
  location: GeolocationCoordinates,
  photos: ArrayBuffer[],
  plantId?: string,
  id?: number,
) => {
  const photoData = photos.map((photoData) => ({
    data: photoData,
  }));

  return plantSiteUploadTable.put({
    id: id,
    plantId: plantId,
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy,
    photos: photoData,
  });
};
