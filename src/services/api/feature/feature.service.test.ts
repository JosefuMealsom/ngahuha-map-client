import 'fake-indexeddb/auto';
import { expect, describe, it, afterEach, beforeEach, beforeAll } from 'vitest';
import offlineDatabase, { featureTable } from '../../offline.database';
import { fetchFeatures, syncFeaturesOffline } from './feature.service';
import { mockApiCall } from '../../../test-helpers/fetch-stub';
import { getFullApiPath } from '../../../utils/api-url.util';

describe('FeatureService', () => {
  afterEach(() => {
    featureTable.clear();
  });

  const feature1 = {
    id: '123',
    name: 'Cool feature',
    description: 'Pretty rad',
    latitude: 10,
    longitude: 20,
    accuracy: 30,
    createdAt: '1988-11-11T00:00:00.000Z',
    updatedAt: '1988-11-11T00:00:00.000Z',
  };
  const feature2 = {
    id: '456',
    name: 'Interesting feature',
    description: 'Quite interesting',
    latitude: 40,
    longitude: 50,
    accuracy: 60,
    createdAt: '1988-11-11T00:00:00.000Z',
    updatedAt: '1988-11-11T00:00:00.000Z',
  };

  describe('fetch()', () => {
    it('fetches the data from the API and returns it', async () => {
      mockApiCall(getFullApiPath('feature'), [feature1, feature2]);

      const features = await fetchFeatures();

      expect(features).toEqual([
        {
          id: '123',
          name: 'Cool feature',
          description: 'Pretty rad',
          latitude: 10,
          longitude: 20,
          accuracy: 30,
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
        {
          id: '456',
          name: 'Interesting feature',
          description: 'Quite interesting',
          latitude: 40,
          longitude: 50,
          accuracy: 60,
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
      ]);
    });
  });

  describe('syncfeaturesOffline()', () => {
    it('fetches the data from the API and saves it to indexedDB', async () => {
      mockApiCall(getFullApiPath('feature'), [feature1, feature2]);

      await syncFeaturesOffline();
      const savedFeatureData = await offlineDatabase.feature.toArray();

      expect(savedFeatureData).toEqual([
        {
          id: '123',
          name: 'Cool feature',
          description: 'Pretty rad',
          latitude: 10,
          longitude: 20,
          accuracy: 30,
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
        {
          id: '456',
          name: 'Interesting feature',
          description: 'Quite interesting',
          latitude: 40,
          longitude: 50,
          accuracy: 60,
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
      ]);
    });

    describe('Plant site already synced offline', () => {
      beforeEach(async () => {
        await featureTable.add({
          id: '123',
          name: 'Cool feature',
          description: 'Pretty rad',
          latitude: 10,
          longitude: 20,
          accuracy: 30,
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        });

        mockApiCall(getFullApiPath('feature'), [
          {
            id: '123',
            name: 'Awesome feature',
            description: 'Kicking rad',
            latitude: 1234,
            longitude: 56789,
            accuracy: 777,
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
          },
        ]);
      });

      it('updates only the changed data', async () => {
        await syncFeaturesOffline();

        const savedDbData = await offlineDatabase.feature.toArray();

        expect(savedDbData).toEqual([
          {
            id: '123',
            name: 'Awesome feature',
            description: 'Kicking rad',
            latitude: 1234,
            longitude: 56789,
            accuracy: 777,
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
          },
        ]);
      });
    });
  });
});
