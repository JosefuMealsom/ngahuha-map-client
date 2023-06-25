import { speciesTable } from '../database/offline.database';
import type { Species } from '../../types/api/species.type';
import apiFetchUtil from '../../utils/api-fetch.util';

class SpeciesService {
  fetch(): Promise<Species[]> {
    return new Promise(async (success) => {
      const dataToJSON = await apiFetchUtil.fetchUpdatedModels(
        speciesTable,
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
      await speciesTable.bulkPut(species);

      success(species);
    });
  }
}

export default new SpeciesService();
