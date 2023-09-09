import 'fake-indexeddb/auto';
import {
  deletePlantSite,
  fetchPlantSites,
  syncPlantSitesOffline,
} from './plant-site.service';
import { expect, describe, it, afterEach, beforeEach } from 'vitest';
import offlineDatabase, { plantSiteTable } from '../../offline.database';
import { mockApiCall } from '../../../test-helpers/fetch-stub';
import { getFullApiPath } from '../../../utils/api-url.util';
import plantSiteFactory from '../../../test-helpers/factories/plant-site';

describe('PlantSiteService', () => {
  afterEach(() => {
    plantSiteTable.clear();
  });

  const plantSite1 = {
    id: '123',
    plantId: '666',
    latitude: 10,
    longitude: 20,
    accuracy: 30,
    createdAt: '1988-11-11T00:00:00.000Z',
    updatedAt: '1988-11-11T00:00:00.000Z',
  };
  const plantSite2 = {
    id: '456',
    plantId: '888',
    latitude: 40,
    longitude: 50,
    accuracy: 60,
    createdAt: '1988-11-11T00:00:00.000Z',
    updatedAt: '1988-11-11T00:00:00.000Z',
  };

  describe('fetch()', () => {
    it('fetches the data from the API and returns it', async () => {
      mockApiCall(getFullApiPath('plant-site'), [plantSite1, plantSite2]);

      const plantSites = await fetchPlantSites();

      expect(plantSites).toEqual([
        {
          id: '123',
          plantId: '666',
          latitude: 10,
          longitude: 20,
          accuracy: 30,
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
        {
          id: '456',
          plantId: '888',
          latitude: 40,
          longitude: 50,
          accuracy: 60,
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
      ]);
    });
  });

  describe('syncPlantSitesOffline()', () => {
    it('fetches the data from the API and saves it to indexedDB', async () => {
      mockApiCall(getFullApiPath('plant-site'), [plantSite1, plantSite2]);

      await syncPlantSitesOffline();
      const savedPlantSiteData = await offlineDatabase.plantSite.toArray();

      expect(savedPlantSiteData).toEqual([
        {
          id: '123',
          plantId: '666',
          latitude: 10,
          longitude: 20,
          accuracy: 30,
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
        {
          id: '456',
          plantId: '888',
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
        await plantSiteTable.add({
          id: '123',
          plantId: '666',
          latitude: 10,
          longitude: 20,
          accuracy: 30,
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        });

        mockApiCall(getFullApiPath('plant-site'), [
          {
            id: '123',
            plantId: '666',
            latitude: 1234,
            longitude: 56789,
            accuracy: 777,
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
          },
        ]);
      });

      it('updates only the changed data', async () => {
        await syncPlantSitesOffline();

        const savedDbData = await offlineDatabase.plantSite.toArray();

        expect(savedDbData).toEqual([
          {
            id: '123',
            plantId: '666',
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

  describe('deletePlantSite)', () => {
    beforeEach(async () => {
      await plantSiteTable.add(plantSiteFactory.create({ id: '123' }));

      mockApiCall(getFullApiPath('plant-site/123'), {}, 'delete', 200);
    });

    it('calls the endpoint and on success deletes the photo', async () => {
      await deletePlantSite('123');
      const photos = await plantSiteTable.toArray();
      expect(photos.length).toEqual(0);
    });
  });
});
