import offlineDatabase from '../database/offline.database';
import apiUrlService from './api-url.service';
import type { Species } from '../../types/api/species.type';

class SpeciesService {
  fetch(): Promise<[Species]> {
    return new Promise(async (success) => {
      const data = await fetch(apiUrlService.getFullPath('species'));
      const dataToJSON = await data.json();

      const species = dataToJSON.map((species: Species) => {
        return {
          id: species.id as string,
          genus_id: species.genus_id as string,
          type_id: species.type_id as string,
          common_name: species.common_name as [],
          name: species.name as string,
        };
      });

      success(species);
    });
  }

  syncOffline(): Promise<[Species]> {
    return new Promise(async (success) => {
      const species = await this.fetch();
      await offlineDatabase.species.bulkAdd(species);

      success(species);
    });
  }
}

export default new SpeciesService();
