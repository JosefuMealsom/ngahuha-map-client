import { Feature } from '../../../types/api/feature.type';
import { featureTable } from '../../offline.database';
import apiFetchUtil from '../../../utils/api-fetch.util';

export const fetchFeatures = (): Promise<Feature[]> => {
  return new Promise(async (success) => {
    const dataToJSON = await apiFetchUtil.fetchUpdatedModels(
      featureTable,
      'feature',
    );

    const features = dataToJSON.map((feature: Feature): Feature => {
      return {
        id: feature.id,
        name: feature.name,
        description: feature.description,
        latitude: feature.latitude,
        longitude: feature.longitude,
        accuracy: feature.accuracy,
        createdAt: feature.createdAt,
        updatedAt: feature.updatedAt,
      };
    });

    success(features);
  });
};

export const syncFeaturesOffline = (): Promise<Feature[]> => {
  return new Promise(async (success) => {
    const featureServerData = await fetchFeatures();

    await featureTable.bulkPut(featureServerData);

    success(featureServerData);
  });
};
