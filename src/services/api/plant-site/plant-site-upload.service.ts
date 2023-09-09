import { LatLong } from '../../../types/lat-long.type';
import { plantSiteUploadTable, plantTable } from '../../offline.database';

class PlantIdMissingError extends Error {
  constructor(plantId: string) {
    super(`Plant with id: '${plantId}' not found`);
    this.name = 'PlantIdMissingError';
  }
}

type PhotoFileData = { file: Blob; primaryPhoto: boolean };
type ConvertedPhotoFileData = { data: ArrayBuffer; primaryPhoto: boolean };

export const addPlantSiteWithPhoto = async (
  photoFiles: PhotoFileData | PhotoFileData[],
  location: LatLong,
  plantId?: string,
  plantSiteUploadId?: number,
) => {
  const photos = await Promise.all(
    [photoFiles].flat().map(async (photoFile) => {
      const convertedData = await photoFile.file.arrayBuffer();
      return { data: convertedData, primaryPhoto: photoFile.primaryPhoto };
    }),
  );

  if (plantId) {
    await validatePlantExists(plantId);
  }

  return addPlantSiteUpload(location, photos, plantId, plantSiteUploadId);
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
  location: LatLong,
  photoData: ConvertedPhotoFileData[],
  plantId?: string,
  id?: number,
) => {
  return plantSiteUploadTable.put({
    id: id,
    plantId: plantId,
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy,
    photos: photoData,
  });
};
