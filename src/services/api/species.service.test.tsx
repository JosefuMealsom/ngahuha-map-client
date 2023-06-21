import speciesServices from './species.service';
import { expect, describe, it } from 'vitest';
import { fetchStub } from '../../test-helpers/fetch-stub';
import offlineDatabase from '../database/offline.database';

describe('SpeciesService', () => {
  const species1 = {
    id: '123',
    genusId: 'gg123',
    typeId: 'tt123',
    name: 'special species',
    commonNames: [],
  };
  const species2 = {
    id: '456',
    genusId: 'gg456',
    typeId: 'tt567',
    name: 'average species',
    commonNames: [],
  };

  describe('fetch()', () => {
    it('fetches the data from the API and returns it', async () => {
      fetchStub.stubFetchResponse([species1, species2]);

      const species = await speciesServices.fetch();
      fetchStub.assertEndPointCalled('https://www.dummy-api.com/species');

      expect(species).toEqual([
        {
          id: '123',
          genusId: 'gg123',
          typeId: 'tt123',
          name: 'special species',
          commonNames: [],
        },
        {
          id: '456',
          genusId: 'gg456',
          typeId: 'tt567',
          name: 'average species',
          commonNames: [],
        },
      ]);
    });
  });

  describe('syncOffline()', () => {
    it('fetches the data from the API and saves it to indexedDB', async () => {
      fetchStub.stubFetchResponse([species1, species2]);

      await speciesServices.syncOffline();
      const savedDbData = await offlineDatabase.species.toArray();

      expect(savedDbData).toEqual([
        {
          id: '123',
          genusId: 'gg123',
          typeId: 'tt123',
          name: 'special species',
          commonNames: [],
        },
        {
          id: '456',
          genusId: 'gg456',
          typeId: 'tt567',
          name: 'average species',
          commonNames: [],
        },
      ]);
    });
  });
});
