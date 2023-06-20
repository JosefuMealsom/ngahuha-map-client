import type { Genus } from '../../types/api/genus.type';
import offlineDatabase from '../database/offline.database';
import apiUrlService from './api-url.service';

class GenusService {
  fetch(): Promise<[Genus]> {
    return new Promise(async (success) => {
      const data = await fetch(apiUrlService.getFullPath('genus'));
      const dataToJSON = await data.json();

      const genera = dataToJSON.map((genus: Genus) => {
        return {
          id: genus.id as string,
          name: genus.name as string,
        };
      });

      success(genera);
    });
  }

  syncOffline(): Promise<[Genus]> {
    return new Promise(async (success, reject) => {
      const genera = await this.fetch();
      await offlineDatabase.genus.bulkAdd(genera);

      success(genera);
    });
  }
}

export default new GenusService();
