import type { GardenArea } from '../../types/api/garden-area.type';
import offlineDatabase from '../database/offline.database';
import apiUrlService from './api-url.service';

class GardenAreaService {
  fetch(): Promise<GardenArea[]> {
    return new Promise(async (success, reject) => {
      const data = await fetch(apiUrlService.getFullPath('garden-area'));
      const dataToJSON = await data.json();

      // Worried about the type safety here. JSON returns an any
      // type that can be assigned to anything therefore it overrides
      // type checking when assigned to a property.
      // Are there downsides to this approach?
      const gardenAreas = dataToJSON.map((area: GardenArea) => {
        return {
          id: area.id as string,
          name: area.name as string,
          description: area.description as string,
        };
      });

      success(gardenAreas);
    });
  }

  syncOffline(): Promise<GardenArea[]> {
    return new Promise(async (success, reject) => {
      const gardenAreas = await this.fetch();
      await offlineDatabase.gardenArea.bulkAdd(gardenAreas);

      success(gardenAreas);
    });
  }
}

export default new GardenAreaService();
