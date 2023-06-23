import type { GardenArea } from '../../types/api/garden-area.type';
import offlineDatabase from '../database/offline.database';
import apiFetchUtil from '../../utils/api-fetch.util';

class GardenAreaService {
  fetch(): Promise<GardenArea[]> {
    return new Promise(async (success, reject) => {
      const dataToJSON = await apiFetchUtil.fetchUpdatedModels(
        offlineDatabase.gardenArea,
        'garden-area',
      );

      // Worried about the type safety here. JSON returns an any
      // type that can be assigned to anything therefore it overrides
      // type checking when assigned to a property.
      // Are there downsides to this approach?
      const gardenAreas = dataToJSON.map((area: GardenArea): GardenArea => {
        return {
          id: area.id as string,
          name: area.name as string,
          description: area.description as string,
          createdAt: area.createdAt as string,
          updatedAt: area.updatedAt as string,
        };
      });

      success(gardenAreas);
    });
  }

  syncOffline(): Promise<GardenArea[]> {
    return new Promise(async (success, reject) => {
      const gardenAreas = await this.fetch();
      await offlineDatabase.gardenArea.bulkPut(gardenAreas);

      success(gardenAreas);
    });
  }
}

export default new GardenAreaService();
