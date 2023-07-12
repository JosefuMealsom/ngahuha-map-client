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
  photoBlob: Blob,
  location: GeolocationCoordinates,
  plantId: string,
) => {
  return new Promise(async (success, reject) => {
    const plant = await plantTable.get(plantId);

    if (!plant) {
      reject(new PlantIdMissingError(plantId));
    }

    offlineDatabase.transaction(
      'rw',
      plantSiteUploadTable,
      plantSitePhotoUploadTable,
      async () => {
        const plantSiteId = await addPlantSiteUpload(plantId, location);
        await addPlantSitePhotoUpload(plantSiteId as number, photoBlob);

        success(plantSiteId);
      },
    );
  });
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

const addPlantSiteUpload = (
  plantId: string,
  location: GeolocationCoordinates,
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
  photoBlob: Blob,
) => {
  return await plantSitePhotoUploadTable.add({
    plantSiteUploadId: plantSiteId,
    data: await photoBlob.arrayBuffer(),
  });
};
