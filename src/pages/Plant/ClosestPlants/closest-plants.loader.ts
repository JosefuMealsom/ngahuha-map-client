import { LoaderFunctionArgs } from 'react-router-dom';
import {
  featureTable,
  plantSiteTable,
  plantTable,
} from '../../../services/offline.database';
import { partition } from 'underscore';

export const closestPlantsLoader = async (loaderArgs: LoaderFunctionArgs) => {
  const plants = await plantTable.toArray();
  const plantSites = await plantSiteTable.toArray();

  return { plants: plants, plantSites: plantSites };
};
