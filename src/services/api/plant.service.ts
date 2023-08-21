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
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: description }),
  });

  if (!result.ok) {
    throw Error(
      `Login failed: ${result.status}, ${(await result.json()).message}`,
    );
  }

  const dataToJSON = await result.json();
  plantTable.put(dataToJSON);

  return dataToJSON;
};

export const updateExtendedInfo = async (
  plantId: string,
  data: { tags: string[]; types: string[]; commonNames: string[] },
) => {
  const result = await fetch(getFullApiPath(`plant/${plantId}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      extendedInfo: {
        tags: data.tags.map((tag) => tag.trim()),
        types: data.types.map((type) => type.trim()),
        commonNames: data.commonNames.map((name) => name.trim()),
      },
    }),
  });

  const dataToJSON = await result.json();
  await plantTable.put(dataToJSON);

  return dataToJSON;
};

export const createPlant = async (
  species: string,
  cultivar: string,
  description: string,
) => {
  const createData = {
    species: species,
    cultivar: cultivar,
    description: description,
  };

  const result = await fetch(getFullApiPath('plant'), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createData),
  });

  if (!result.ok) {
    throw Error(
      `Upload failed: ${result.status}, ${(await result.json()).message}`,
    );
  }

  const dataToJSON = await result.json();

  await plantTable.put(dataToJSON);
  return dataToJSON;
};
