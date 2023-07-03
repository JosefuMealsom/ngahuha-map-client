import 'fake-indexeddb/auto';
import { fetchPlantSites, syncPlantSitesOffline } from './plant-site.service';
import { expect, describe, it, afterEach, beforeEach } from 'vitest';
import offlineDatabase, { plantSiteTable } from '../offline.database';
import {
  assertEndPointCalled,
  stubFetchResponse,
} from '../../test-helpers/fetch-stub';

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
  const location: GeolocationCoordinates = {
    accuracy: 10,
    latitude: 20,
    longitude: 30,
    altitude: 111,
    altitudeAccuracy: 111,
    heading: 111,
    speed: 111,
  };

  describe('fetch()', () => {
    it('fetches the data from the API and returns it', async () => {
      stubFetchResponse([plantSite1, plantSite2]);

      const plantSites = await fetchPlantSites();
      assertEndPointCalled('https://www.dummy-api.com/plant-site');

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
      stubFetchResponse([plantSite1, plantSite2]);

      await syncPlantSitesOffline();
      const savedDbData = await offlineDatabase.plantSite.toArray();

      expect(savedDbData).toEqual([
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

        stubFetchResponse([
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
        assertEndPointCalled(
          'https://www.dummy-api.com/plant-site?lastModified=1988-11-11T00%3A00%3A00.000Z',
        );

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
});