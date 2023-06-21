import { PlantSite } from '../../types/api/plant-site.type';
import offlineDatabase from '../database/offline.database';
import apiUrlService from './api-url.service';

class PlantSiteService {
  fetch(): Promise<PlantSite[]> {
    return new Promise(async (success) => {
      const data = await fetch(apiUrlService.getFullPath('species'));
      const dataToJSON = await data.json();

      const species = dataToJSON.map((plantSite: PlantSite) => {
        return {
          id: plantSite.id as string,
          speciesId: plantSite.speciesId as string,
          latitude: plantSite.latitude as number,
          longitude: plantSite.longitude as number,
          accuracy: plantSite.accuracy as number,
        };
      });

      success(species);
    });
  }

  syncOffline(): Promise<PlantSite[]> {
    return new Promise(async (success) => {
      const plantSites = await this.fetch();
      await offlineDatabase.plantSite.bulkAdd(plantSites);

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
    return new Promise((success) => {
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
