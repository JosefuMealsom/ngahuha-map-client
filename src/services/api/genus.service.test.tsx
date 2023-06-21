import genusService from './genus.service';
import { expect, describe, it } from 'vitest';
import { fetchStub } from '../../test-helpers/fetch-stub';
import offlineDatabase from '../database/offline.database';

describe('GenusService', () => {
  const genus1 = { id: '123', name: 'welcome to the family' };
  const genus2 = { id: '346', name: 'genius genus' };

  describe('fetch()', () => {
    it('fetches the data from the API and returns it', async () => {
      fetchStub.stubFetchResponse([genus1, genus2]);

      const genera = await genusService.fetch();
      fetchStub.assertEndPointCalled('https://www.dummy-api.com/genus');

      expect(genera).toEqual([
        { id: '123', name: 'welcome to the family' },
        { id: '346', name: 'genius genus' },
      ]);
    });
  });

  describe('syncOnline()', () => {
    it('fetches the data from the API and saves it to indexedDB', async () => {
      fetchStub.stubFetchResponse([genus1, genus2]);

      await genusService.syncOffline();
      const savedDbData = await offlineDatabase.genus.toArray();

      expect(savedDbData).toEqual([
        { id: '123', name: 'welcome to the family' },
        { id: '346', name: 'genius genus' },
      ]);
    });
  });
});
