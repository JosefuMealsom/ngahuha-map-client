import 'fake-indexeddb/auto';
import plantSiteService from './plant-site.service';
import { expect, describe, it, afterEach } from 'vitest';
import offlineDatabase from '../database/offline.database';
import { fetchStub } from '../../test-helpers/fetch-stub';

describe('PlantSiteService', () => {
  afterEach(() => {
    offlineDatabase.plantSite.clear();
  });

  const plantSite1 = {
    id: '123',
    speciesId: '666',
    latitude: 10,
    longitude: 20,
    accuracy: 30,
  };
  const plantSite2 = {
    id: '456',
    speciesId: '888',
    latitude: 40,
    longitude: 50,
    accuracy: 60,
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
      fetchStub.stubFetchResponse([plantSite1, plantSite2]);

      const plantSites = await plantSiteService.fetch();
      fetchStub.assertEndPointCalled('https://www.dummy-api.com/species');

      expect(plantSites).toEqual([
        {
          id: '123',
          speciesId: '666',
          latitude: 10,
          longitude: 20,
          accuracy: 30,
        },
        {
          id: '456',
          speciesId: '888',
          latitude: 40,
          longitude: 50,
          accuracy: 60,
        },
      ]);
    });
  });

  describe('syncOffline()', () => {
    it('fetches the data from the API and saves it to indexedDB', async () => {
      fetchStub.stubFetchResponse([plantSite1, plantSite2]);

      await plantSiteService.syncOffline();
      const savedDbData = await offlineDatabase.plantSite.toArray();

      expect(savedDbData).toEqual([
        {
          id: '123',
          speciesId: '666',
          latitude: 10,
          longitude: 20,
          accuracy: 30,
        },
        {
          id: '456',
          speciesId: '888',
          latitude: 40,
          longitude: 50,
          accuracy: 60,
        },
      ]);
    });
  });

  describe('add()', () => {
    it('adds a new plant site and saves it offline', async () => {
      const blob = new Blob();
      await plantSiteService.add(blob, location, 'abc');
      const savedPlantSiteData = await offlineDatabase.plantSite.toArray();

      expect(savedPlantSiteData.length).toEqual(1);
      const plantSite = savedPlantSiteData[0];
      expect(plantSite.accuracy).toEqual(10);
      expect(plantSite.latitude).toEqual(20);
      expect(plantSite.longitude).toEqual(30);

      const savedPlantPhotoData =
        await offlineDatabase.plantSitePhoto.toArray();
      expect(savedPlantPhotoData.length).toEqual(1);
      const photo = savedPlantPhotoData[0];
      expect(photo.plantSiteId).toEqual(plantSite.id);
    });
  });
});
