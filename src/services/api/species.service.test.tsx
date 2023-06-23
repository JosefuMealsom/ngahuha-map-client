import speciesService from './species.service';
import { expect, describe, it, beforeEach, afterEach } from 'vitest';
import { fetchStub } from '../../test-helpers/fetch-stub';
import offlineDatabase from '../database/offline.database';

describe('SpeciesService', () => {
  afterEach(() => {
    offlineDatabase.species.clear();
  });
  const species1 = {
    id: '123',
    genusId: 'gg123',
    typeId: 'tt123',
    name: 'special species',
    commonNames: [],
    createdAt: '1988-11-11T00:00:00.000Z',
    updatedAt: '1988-11-11T00:00:00.000Z',
  };
  const species2 = {
    id: '456',
    genusId: 'gg456',
    typeId: 'tt567',
    name: 'average species',
    commonNames: [],
    createdAt: '1988-11-11T00:00:00.000Z',
    updatedAt: '1988-11-11T00:00:00.000Z',
  };

  describe('fetch()', () => {
    it('fetches the data from the API and returns it', async () => {
      fetchStub.stubFetchResponse([species1, species2]);

      const species = await speciesService.fetch();
      fetchStub.assertEndPointCalled('https://www.dummy-api.com/species');

      expect(species).toEqual([
        {
          id: '123',
          genusId: 'gg123',
          typeId: 'tt123',
          name: 'special species',
          commonNames: [],
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
        {
          id: '456',
          genusId: 'gg456',
          typeId: 'tt567',
          name: 'average species',
          commonNames: [],
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
      ]);
    });
  });

  describe('syncOffline()', () => {
    it('fetches the data from the API and saves it to indexedDB', async () => {
      fetchStub.stubFetchResponse([species1, species2]);

      await speciesService.syncOffline();
      const savedDbData = await offlineDatabase.species.toArray();

      expect(savedDbData).toEqual([
        {
          id: '123',
          genusId: 'gg123',
          typeId: 'tt123',
          name: 'special species',
          commonNames: [],
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
        {
          id: '456',
          genusId: 'gg456',
          typeId: 'tt567',
          name: 'average species',
          commonNames: [],
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        },
      ]);
    });

    describe('Species already synced offline', () => {
      beforeEach(async () => {
        await offlineDatabase.species.add({
          id: '123',
          genusId: 'gg123',
          typeId: 'tt123',
          name: 'special species',
          commonNames: [],
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
        });

        fetchStub.stubFetchResponse([
          {
            id: '123',
            genusId: 'gg123',
            typeId: 'tt123',
            name: 'pretty common species',
            commonNames: ['common daisy'],
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
          },
        ]);
      });

      it('updates only the changed data', async () => {
        await speciesService.syncOffline();
        fetchStub.assertEndPointCalled(
          'https://www.dummy-api.com/species?lastModified=1988-11-11T00%3A00%3A00.000Z',
        );

        const savedDbData = await offlineDatabase.species.toArray();

        expect(savedDbData).toEqual([
          {
            id: '123',
            genusId: 'gg123',
            typeId: 'tt123',
            name: 'pretty common species',
            commonNames: ['common daisy'],
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
          },
        ]);
      });
    });
  });
});
