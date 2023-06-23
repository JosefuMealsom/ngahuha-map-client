import offlineDatabase from '../database/offline.database';
import apiUrlService from './api-url.service';
import type { Species } from '../../types/api/species.type';
import apiFetchUtil from './api-fetch.util';

class SpeciesService {
  fetch(): Promise<Species[]> {
    return new Promise(async (success) => {
      const dataToJSON = await apiFetchUtil.fetchUpdatedModels(
        offlineDatabase.species,
        'species',
      );

      const species = dataToJSON.map((species: Species): Species => {
        return {
          id: species.id as string,
          genusId: species.genusId as string,
          typeId: species.typeId as string,
          commonNames: species.commonNames as [],
          name: species.name as string,
          createdAt: species.createdAt as string,
          updatedAt: species.updatedAt as string,
        };
      });

      success(species);
    });
  }

  syncOffline(): Promise<Species[]> {
    return new Promise(async (success) => {
      const species = await this.fetch();
      await offlineDatabase.species.bulkPut(species);

      success(species);
    });
  }
}

export default new SpeciesService();
