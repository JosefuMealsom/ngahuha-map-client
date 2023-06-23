import { PlantSite } from '../../types/api/plant-site.type';
import offlineDatabase from '../database/offline.database';
import apiFetchUtil from '../../utils/api-fetch.util';

class PlantSiteServiceMissingSpeciesError extends Error {
  constructor(speciesId: string) {
    super(`Species with id: '${speciesId}' not found`);
  }
}

class PlantSiteService {
  fetch(): Promise<PlantSite[]> {
    return new Promise(async (success) => {
      const dataToJSON = await apiFetchUtil.fetchUpdatedModels(
        offlineDatabase.plantSite,
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
          speciesId: plantSite.speciesId as string,
          latitude: plantSite.latitude as number,
          longitude: plantSite.longitude as number,
          accuracy: plantSite.accuracy as number,
          createdAt: createdAt,
          updatedAt: updatedAt,
        };
      });

      success(species);
    });
  }

  syncOffline(): Promise<PlantSite[]> {
    return new Promise(async (success) => {
      const plantSites = await this.fetch();
      await offlineDatabase.plantSite.bulkPut(plantSites);

      success(plantSites);
    });
  }

  all() {
    return offlineDatabase.plantSite.toArray();
  }

  async add(
    photoBlob: Blob,
    location: GeolocationCoordinates,
    speciesId: string,
  ) {
    return new Promise(async (success, reject) => {
      const species = await offlineDatabase.species.get(speciesId);

      if (!species) {
        reject(new PlantSiteServiceMissingSpeciesError(speciesId));
      }

      offlineDatabase.transaction(
        'rw',
        offlineDatabase.plantSite,
        offlineDatabase.plantSitePhoto,
        async () => {
          const plantId = await this.addPlantSite(speciesId, location);
          await this.addPlantSitePhoto(plantId as string, photoBlob);

          success(plantId);
        },
      );
    });
  }

  async delete(id: string) {
    return await offlineDatabase.plantSitePhoto.delete(id);
  }

  private async addPlantSite(
    speciesId: string,
    location: GeolocationCoordinates,
  ) {
    return offlineDatabase.plantSite.add({
      speciesId: speciesId,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
    });
  }

  private async addPlantSitePhoto(plantSiteId: string, photoBlob: Blob) {
    return await offlineDatabase.plantSitePhoto.add({
      plantSiteId: plantSiteId as string,
      data: photoBlob,
    });
  }
}

export default new PlantSiteService();
