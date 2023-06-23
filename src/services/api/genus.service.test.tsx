import genusService from './genus.service';
import { expect, describe, it, beforeEach, afterEach } from 'vitest';
import { fetchStub } from '../../test-helpers/fetch-stub';
import offlineDatabase from '../database/offline.database';

describe('GenusService', () => {
  afterEach(() => {
    offlineDatabase.genus.clear();
  });

  const genus1 = {
    id: '123',
    name: 'welcome to the family',
    createdAt: '1988-11-11T00:00:00.000Z',
    updatedAt: '1988-11-11T00:00:00.000Z',
  };
  const genus2 = {
    id: '346',
    name: 'genius genus',
    createdAt: '1988-11-11T00:00:00.000Z',
    updatedAt: '1988-11-11T00:00:00.000Z',
  };

  describe('fetch()', () => {
    it('fetches the data from the API and returns it', async () => {
      fetchStub.stubFetchResponse([genus1, genus2]);

      const genera = await genusService.fetch();
      fetchStub.assertEndPointCalled('https://www.dummy-api.com/genus');

      expect(genera).toEqual([
        {
          id: '123',
          name: 'welcome to the family',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
        {
          id: '346',
          name: 'genius genus',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
      ]);
    });
  });

  describe('syncOffline()', () => {
    it('fetches the data from the API and saves it to indexedDB', async () => {
      fetchStub.stubFetchResponse([genus1, genus2]);

      await genusService.syncOffline();
      const savedDbData = await offlineDatabase.genus.toArray();
      expect(savedDbData).toEqual([
        {
          id: '123',
          name: 'welcome to the family',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
        {
          id: '346',
          name: 'genius genus',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
      ]);
    });

    describe('Genus already synced offline', () => {
      beforeEach(async () => {
        await offlineDatabase.genus.add({
          id: '123',
          name: 'welcome to the family',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        });

        fetchStub.stubFetchResponse([
          {
            id: '123',
            name: 'goodbye to the family',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
          },
        ]);
      });

      it('updates only the changed data', async () => {
        await genusService.syncOffline();
        fetchStub.assertEndPointCalled(
          'https://www.dummy-api.com/genus?lastModified=1988-11-11T00%3A00%3A00.000Z',
        );

        const savedDbData = await offlineDatabase.genus.toArray();

        expect(savedDbData).toEqual([
          {
            id: '123',
            name: 'goodbye to the family',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
          },
        ]);
      });
    });
  });
});
