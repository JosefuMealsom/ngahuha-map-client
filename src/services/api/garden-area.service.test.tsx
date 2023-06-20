import 'fake-indexeddb/auto';
import gardenAreaService from './garden-area.service';
import { expect, describe, it } from 'vitest';
import { fetchStub } from '../../test-helpers/fetch-stub';
import offlineDatabase from '../database/offline.database';

describe('GardenAreaService', () => {
  describe('fetch()', () => {
    it('fetches the data from the API and returns it', async () => {
      fetchStub.stubFetchResponse([
        {
          id: 'abc',
          name: 'Most beautiful area',
          description: 'SO BEAUTIFUL!',
        },
      ]);

      const gardenAreas = await gardenAreaService.fetch();
      fetchStub.assertEndPointCalled('https://www.dummy-api.com/garden-area');

      expect(gardenAreas).toEqual([
        {
          id: 'abc',
          name: 'Most beautiful area',
          description: 'SO BEAUTIFUL!',
        },
      ]);
    });
  });

  describe('syncOnline()', () => {
    it('fetches the data from the API and saves it to indexedDB', async () => {
      fetchStub.stubFetchResponse([
        {
          id: 'abc',
          name: 'Most beautiful area',
          description: 'SO BEAUTIFUL!',
        },
        {
          id: 'cde',
          name: 'Second most beautiful area',
          description: 'NOT AS BEAUTIFUL!',
        },
      ]);

      await gardenAreaService.syncOffline();
      const savedDbData = await offlineDatabase.gardenArea.toArray();

      expect(savedDbData).toEqual([
        {
          id: 'abc',
          name: 'Most beautiful area',
          description: 'SO BEAUTIFUL!',
        },
        {
          id: 'cde',
          name: 'Second most beautiful area',
          description: 'NOT AS BEAUTIFUL!',
        },
      ]);
    });
  });
});
