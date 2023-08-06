import { PlantSiteUpload } from '../../types/api/upload/plant-site-upload.type';
import offlineDatabase, {
  plantSitePhotoUploadTable,
  plantSiteUploadTable,
  plantTable,
} from '../offline.database';

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

  return offlineDatabase.transaction(
    'rw',
    plantSiteUploadTable,
    plantSitePhotoUploadTable,
    async () => {
      return new Promise(async (success) => {
        const plantSiteId = await addPlantSiteUpload(location, plantId);

        await Promise.all(
          photos.map(async (photoBuffer) =>
            addPlantSitePhotoUpload(plantSiteId as number, photoBuffer),
          ),
        );

        success(plantSiteId);
      });
    },
  );
};

export const deletePlantSite = async (id: number) => {
  offlineDatabase.transaction(
    'rw',
    plantSiteUploadTable,
    plantSitePhotoUploadTable,
    async () => {
      const photoIds = await plantSitePhotoUploadTable
        .where({
          plantSiteUploadId: id,
        })
        .toArray();

      // Bit funky here, Dexie has issues with the id type being conditional
      // so it always complains that I may have undefined returned.
      const idsToDelete = photoIds.map((item) => item.id as number);
      const filteredNumbers = idsToDelete.filter((id) => id !== undefined);

      await plantSitePhotoUploadTable.bulkDelete(filteredNumbers);
      await plantSiteUploadTable.delete(id);
    },
  );
};

const validatePlantExists = async (plantId: string) => {
  const plant = await plantTable.get(plantId);

  if (!plant) {
    throw new PlantIdMissingError(plantId);
  }
};

const addPlantSiteUpload = (
  location: GeolocationCoordinates,
  plantId?: string,
) => {
  return plantSiteUploadTable.add({
    plantId: plantId,
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy,
  });
};

const addPlantSitePhotoUpload = async (
  plantSiteId: number,
  photoData: ArrayBuffer,
) => {
  return plantSitePhotoUploadTable.add({
    plantSiteUploadId: plantSiteId,
    data: photoData,
  });
};
