import type { Plant } from '../../types/api/plant.type';
import apiFetchUtil from '../../utils/api-fetch.util';
import axiosClient from '../axios/axios-client';
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
  const result = await axiosClient.patch(`plant/${plantId}`, {
    description: description,
  });

  const dataToJSON = await result.data;
  plantTable.put(dataToJSON);

  return dataToJSON;
};

export const updateExtendedInfo = async (
  plantId: string,
  data: { tags: string[]; types: string[]; commonNames: string[] },
) => {
  const result = await axiosClient.patch(`plant/${plantId}`, {
    extendedInfo: {
      tags: data.tags.map((tag) => tag.trim()),
      types: data.types.map((type) => type.trim()),
      commonNames: data.commonNames.map((name) => name.trim()),
    },
  });

  await plantTable.put(result.data);

  return result.data;
};

export const updatePlant = async (plantId: string, data: CreatePlantData) => {
  const updateData = {
    species: data.species,
    cultivar: data.cultivar,
    description: data.description,
    extendedInfo: {
      tags: data.extendedInfo.tags.map((tag) => tag.trim()),
      types: data.extendedInfo.types.map((type) => type.trim()),
      commonNames: data.extendedInfo.commonNames.map((name) => name.trim()),
    },
  };

  const result = await axiosClient.patch(`plant/${plantId}`, updateData);

  await plantTable.put(result.data);
  return result.data;
};

export const createPlant = async (data: CreatePlantData) => {
  const createData = {
    species: data.species,
    cultivar: data.cultivar,
    description: data.description,
    extendedInfo: {
      tags: data.extendedInfo.tags.map((tag) => tag.trim()),
      types: data.extendedInfo.types.map((type) => type.trim()),
      commonNames: data.extendedInfo.commonNames.map((name) => name.trim()),
    },
  };

  const result = await axiosClient.post(`plant`, createData);

  await plantTable.put(result.data);
  return result.data;
};
