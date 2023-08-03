import 'fake-indexeddb/auto';
import { expect, describe, it, afterEach, beforeEach } from 'vitest';
import { plantTable } from '../offline.database';
import {
  assertEndPointCalled,
  stubFetchResponse,
} from '../../test-helpers/fetch-stub';
import { fetchPlants, syncPlantsOffline } from './plant.service';

describe('PlantService', () => {
  afterEach(() => {
    plantTable.clear();
  });

  const plant1 = {
    id: '123',
    typeId: '456',
    species: 'joeus maximus',
    cultivar: 'pretty lady',
    createdAt: '1988-11-11T00:00:00.000Z',
    updatedAt: '1988-11-11T00:00:00.000Z',
    extendedInfo: { description: 'Wow so cool!' },
  };

  const plant2 = {
    id: 'abc',
    typeId: 'def',
    species: 'bread and butter bobby',
    cultivar: 'handsome gentleman',
    createdAt: '2020-11-11T00:00:00.000Z',
    updatedAt: '2020-11-11T00:00:00.000Z',
    extendedInfo: {
      'real name': 'Wow so cool!',
      'some other property': 'Wow so interesting!',
    },
  };

  describe('fetch()', () => {
    it('fetches the data from the API and returns it', async () => {
      stubFetchResponse([plant1, plant2]);

      const plantSites = await fetchPlants();
      assertEndPointCalled('https://www.dummy-api.com/plant');

      expect(plantSites).toEqual([
        {
          id: '123',
          typeId: '456',
          species: 'joeus maximus',
          cultivar: 'pretty lady',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
          extendedInfo: { description: 'Wow so cool!' },
        },
        {
          id: 'abc',
          typeId: 'def',
          species: 'bread and butter bobby',
          cultivar: 'handsome gentleman',
          createdAt: '2020-11-11T00:00:00.000Z',
          updatedAt: '2020-11-11T00:00:00.000Z',
          extendedInfo: {
            'real name': 'Wow so cool!',
            'some other property': 'Wow so interesting!',
          },
        },
      ]);
    });
  });

  describe('syncOffline()', () => {
    it('fetches the data from the API and saves it to indexedDB', async () => {
      stubFetchResponse([plant1, plant2]);

      await syncPlantsOffline();
      const savedDbData = await plantTable.toArray();

      expect(savedDbData).toEqual([
        {
          id: '123',
          typeId: '456',
          species: 'joeus maximus',
          cultivar: 'pretty lady',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
          extendedInfo: { description: 'Wow so cool!' },
        },
        {
          id: 'abc',
          typeId: 'def',
          species: 'bread and butter bobby',
          cultivar: 'handsome gentleman',
          createdAt: '2020-11-11T00:00:00.000Z',
          updatedAt: '2020-11-11T00:00:00.000Z',
          extendedInfo: {
            'real name': 'Wow so cool!',
            'some other property': 'Wow so interesting!',
          },
        },
      ]);
    });

    describe('Plant already synced offline', () => {
      beforeEach(async () => {
        await plantTable.add({
          id: '123',
          typeId: '456',
          species: 'joeus maximus',
          cultivar: 'pretty lady',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
          extendedInfo: { description: 'Wow so cool!' },
        });

        stubFetchResponse([
          {
            id: '123',
            typeId: '789',
            species: 'joeus minimus',
            cultivar: 'ugly boy',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
            extendedInfo: {
              'real name': 'Wow so cool!',
              'some other property': 'Wow so interesting!',
            },
          },
        ]);
      });

      it('updates only the changed data', async () => {
        await syncPlantsOffline();

        assertEndPointCalled(
          'https://www.dummy-api.com/plant?lastModified=1988-11-11T00%3A00%3A00.000Z',
        );

        const savedDbData = await plantTable.toArray();

        expect(savedDbData).toEqual([
          {
            id: '123',
            typeId: '789',
            species: 'joeus minimus',
            cultivar: 'ugly boy',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
            extendedInfo: {
              'real name': 'Wow so cool!',
              'some other property': 'Wow so interesting!',
            },
          },
        ]);
      });
    });
  });
});
