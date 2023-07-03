import { PlantSite } from '../../types/api/plant-site.type';
import { plantSiteTable } from '../offline.database';
import apiFetchUtil from '../../utils/api-fetch.util';

export const fetchPlantSites = (): Promise<PlantSite[]> => {
  return new Promise(async (success) => {
    const dataToJSON = await apiFetchUtil.fetchUpdatedModels(
      plantSiteTable,
      'plant-site',
    );

    const plantSite = dataToJSON.map((plantSite: PlantSite): PlantSite => {
      return {
        id: plantSite.id as string,
        plantId: plantSite.plantId as string,
        latitude: plantSite.latitude as number,
        longitude: plantSite.longitude as number,
        accuracy: plantSite.accuracy as number,
        createdAt: plantSite.createdAt,
        updatedAt: plantSite.updatedAt,
      };
    });

    success(plantSite);
  });
};

export const syncPlantSitesOffline = (): Promise<PlantSite[]> => {
  return new Promise(async (success) => {
    const plantSites = await fetchPlantSites();
    await plantSiteTable.bulkPut(plantSites);

    success(plantSites);
  });
};
