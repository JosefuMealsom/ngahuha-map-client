import { PlantSite } from '../../types/api/plant-site.type';
import offlineDatabase, {
  plantSitePhotoTable,
  plantSiteTable,
  plantTable,
} from '../database/offline.database';
import apiFetchUtil from '../../utils/api-fetch.util';

class PlantSiteServiceMissingPlantError extends Error {
  constructor(plantId: string) {
    super(`Plant with id: '${plantId}' not found`);
  }
}

export const fetchPlantSites = (): Promise<PlantSite[]> => {
  return new Promise(async (success) => {
    const dataToJSON = await apiFetchUtil.fetchUpdatedModels(
      plantSiteTable,
      'plant-site',
    );

    const species = dataToJSON.map((plantSite: PlantSite): PlantSite => {
      const createdAt = plantSite.createdAt
        ? (plantSite.createdAt as string)
        : undefined;
      const updatedAt = plantSite.updatedAt
        ? (plantSite.createdAt as string)
        : undefined;

      return {
        id: plantSite.id as string,
        plantId: plantSite.plantId as string,
        latitude: plantSite.latitude as number,
        longitude: plantSite.longitude as number,
        accuracy: plantSite.accuracy as number,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };
    });

    success(species);
  });
};

export const syncPlantSitesOffline = (): Promise<PlantSite[]> => {
  return new Promise(async (success) => {
    const plantSites = await fetchPlantSites();
    await plantSiteTable.bulkPut(plantSites);

    success(plantSites);
  });
};

export const addPlantSiteWithPhoto = async (
  photoBlob: Blob,
  location: GeolocationCoordinates,
  plantId: string,
) => {
  return new Promise(async (success, reject) => {
    const plant = await plantTable.get(plantId);

    if (!plant) {
      reject(new PlantSiteServiceMissingPlantError(plantId));
    }
    offlineDatabase.transaction(
      'rw',
      plantSiteTable,
      plantSitePhotoTable,
      async () => {
        const plantSiteId = await addPlantSite(plantId, location);
        await addPlantSitePhoto(plantSiteId as string, photoBlob);

        success(plantSiteId);
      },
    );
  });
};

export const deletePlantSite = async (id: string) => {
  return await plantSiteTable.delete(id);
};

function addPlantSite(plantId: string, location: GeolocationCoordinates) {
  return plantSiteTable.add({
    plantId: plantId,
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy,
  });
}

async function addPlantSitePhoto(plantSiteId: string, photoBlob: Blob) {
  return await plantSitePhotoTable.add({
    plantSiteId: plantSiteId as string,
    data: photoBlob,
  });
}
