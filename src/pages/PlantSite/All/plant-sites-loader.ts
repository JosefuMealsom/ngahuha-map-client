import { plantSiteTable, plantTable } from '../../../services/offline.database';

export const loadAllPlantSites = async () => {
  const plantSites = await plantSiteTable.toArray();
  const plants = await plantTable.toArray();

  return { plantSites: plantSites, plants: plants };
};
