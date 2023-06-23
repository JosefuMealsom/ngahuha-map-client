import type { Genus } from '../../types/api/genus.type';
import offlineDatabase from '../database/offline.database';
import apiFetchUtil from './api-fetch.util';

class GenusService {
  fetch(): Promise<Genus[]> {
    return new Promise<Genus[]>(async (success) => {
      const dataToJSON = await apiFetchUtil.fetchUpdatedModels(
        offlineDatabase.genus,
        'genus',
      );

      const genera = dataToJSON.map((genus: Genus): Genus => {
        return {
          id: genus.id as string,
          name: genus.name as string,
          createdAt: genus.createdAt as string,
          updatedAt: genus.updatedAt as string,
        };
      });

      success(genera);
    });
  }

  syncOffline(): Promise<Genus[]> {
    return new Promise(async (success, reject) => {
      const genera = await this.fetch();
      await offlineDatabase.genus.bulkPut(genera);

      success(genera);
    });
  }
}

export default new GenusService();
