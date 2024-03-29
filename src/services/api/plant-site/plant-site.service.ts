import { PlantSite } from '../../../types/api/plant-site.type';
import { plantSiteTable } from '../../offline.database';
import apiFetchUtil from '../../../utils/api-fetch.util';
import axiosClient from '../../axios/axios-client';

export const fetchPlantSites = (): Promise<PlantSite[]> => {
  return new Promise(async (success) => {
    const dataToJSON = await apiFetchUtil.fetchUpdatedModels(
      plantSiteTable,
      'plant-site',
    );

    const plantSite = dataToJSON.map((plantSite: PlantSite): PlantSite => {
      return {
        id: plantSite.id,
        plantId: plantSite.plantId,
        latitude: plantSite.latitude,
        longitude: plantSite.longitude,
        accuracy: plantSite.accuracy,
        createdAt: plantSite.createdAt,
        updatedAt: plantSite.updatedAt,
      };
    });

    success(plantSite);
  });
};

export const deletePlantSite = async (id: string) => {
  await axiosClient.delete(`plant-site/${id}`);

  plantSiteTable.delete(id);
};

export const syncPlantSitesOffline = (): Promise<PlantSite[]> => {
  return new Promise(async (success) => {
    const plantSiteServerData = await fetchPlantSites();

    await plantSiteTable.bulkPut(plantSiteServerData);

    success(plantSiteServerData);
  });
};
