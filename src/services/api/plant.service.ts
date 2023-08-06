import type { Plant } from '../../types/api/plant.type';
import apiFetchUtil from '../../utils/api-fetch.util';
import { getFullApiPath } from '../../utils/api-url.util';
import { plantTable } from '../offline.database';

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
        extendedInfo: plant.extendedInfo,
        description: plant.description,
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

export const updateDescription = async (
  plantId: string,
  description: string,
) => {
  const result = await fetch(getFullApiPath(`plant/${plantId}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: description }),
  });

  const dataToJSON = await result.json();
  plantTable.put(dataToJSON);

  return dataToJSON;
};
