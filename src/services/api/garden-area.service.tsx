import type { GardenArea } from '../../types/api/garden-area.type';
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
      success([
        {
          id: dataToJSON.id as string,
          name: dataToJSON.name as string,
          description: dataToJSON.description as string,
        },
      ]);
    });
  }
}

export default new GardenAreaService();
