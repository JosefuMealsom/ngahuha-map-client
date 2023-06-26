import type { Plant } from '../../types/api/plant.type';
import apiFetchUtil from '../../utils/api-fetch.util';
import { plantTable } from '../database/offline.database';

export const fetchPlants = (): Promise<Plant[]> => {
  return new Promise(async (success, reject) => {
    const dataToJSON = await apiFetchUtil.fetchUpdatedModels(
      plantTable,
      'plant',
    );

    const plants = dataToJSON.map((plant: Plant): Plant => {
      return {
        id: plant.id,
        species: plant.species,
        cultivar: plant.cultivar,
        typeId: plant.typeId,
        createdAt: plant.createdAt,
        updatedAt: plant.updatedAt,
      };
    });

    success(plants);
  });
};

export const syncPlantsOffline = (): Promise<Plant[]> => {
  return new Promise(async (success, reject) => {
    const plants = await fetchPlants();
    await plantTable.bulkPut(plants);

    success(plants);
  });
};
