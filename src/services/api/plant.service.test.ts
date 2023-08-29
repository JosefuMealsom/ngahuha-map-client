import 'fake-indexeddb/auto';
import { expect, describe, it, afterEach, beforeEach } from 'vitest';
import { plantTable } from '../offline.database';
import {
  assertEndPointCalled,
  stubFetchResponse,
} from '../../test-helpers/fetch-stub';
import {
  createPlant,
  fetchPlants,
  syncPlantsOffline,
  updateDescription,
  updateExtendedInfo,
} from './plant.service';
import plantFactory from '../../test-helpers/factories/plant';

describe('PlantService', () => {
  afterEach(() => {
    plantTable.clear();
  });

  const plant1 = {
    id: '123',
    species: 'joeus maximus',
    cultivar: 'pretty lady',
    createdAt: '1988-11-11T00:00:00.000Z',
    updatedAt: '1988-11-11T00:00:00.000Z',
    extendedInfo: { 'real name': 'Wow so cool!' },
    description: 'Wow very descriptive!',
  };

  const plant2 = {
    id: 'abc',
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
          species: 'joeus maximus',
          cultivar: 'pretty lady',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
          extendedInfo: { 'real name': 'Wow so cool!' },
          description: 'Wow very descriptive!',
        },
        {
          id: 'abc',
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
          species: 'joeus maximus',
          cultivar: 'pretty lady',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
          extendedInfo: { 'real name': 'Wow so cool!' },
          description: 'Wow very descriptive!',
        },
        {
          id: 'abc',
          species: 'bread and butter bobby',
          cultivar: 'handsome gentleman',
          createdAt: '2020-11-11T00:00:00.000Z',
          updatedAt: '2020-11-11T00:00:00.000Z',
          extendedInfo: {
            'real name': 'Wow so cool!',
            'some other property': 'Wow so interesting!',
          },
          description: undefined,
        },
      ]);
    });

    describe('Plant already synced offline', () => {
      beforeEach(async () => {
        await plantTable.add({
          id: '123',
          species: 'joeus maximus',
          cultivar: 'pretty lady',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
          extendedInfo: { description: 'Wow so cool!' },
          description: 'Hmmm not enough information',
        });

        stubFetchResponse([
          {
            id: '123',
            species: 'joeus minimus',
            cultivar: 'ugly boy',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
            extendedInfo: {
              'real name': 'Wow so cool!',
              'some other property': 'Wow so interesting!',
            },
            description: 'Wow very descriptive!',
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
            species: 'joeus minimus',
            cultivar: 'ugly boy',
            createdAt: '2030-11-11T00:00:00.000Z',
            updatedAt: '2030-11-11T00:00:00.000Z',
            extendedInfo: {
              'real name': 'Wow so cool!',
              'some other property': 'Wow so interesting!',
            },
            description: 'Wow very descriptive!',
          },
        ]);
      });
    });
  });

  describe('createPlant()', () => {
    it('creates a new plant on the server and saves it locally', async () => {
      stubFetchResponse(plant1);

      await createPlant({
        species: 'joeus maximus',
        cultivar: 'pretty lady',
        description: 'Wow very descriptive!',
        extendedInfo: { types: [], tags: [], commonNames: [] },
      });
      assertEndPointCalled('https://www.dummy-api.com/plant');

      const savedDbData = await plantTable.toArray();

      expect(savedDbData).toEqual([
        {
          id: '123',
          species: 'joeus maximus',
          cultivar: 'pretty lady',
          createdAt: '1988-11-11T00:00:00.000Z',
          updatedAt: '1988-11-11T00:00:00.000Z',
          extendedInfo: { 'real name': 'Wow so cool!' },
          description: 'Wow very descriptive!',
        },
      ]);
    });
  });

  describe('updateExtendedInfo()', () => {
    beforeEach(async () => {
      await plantTable.add(
        plantFactory.create({
          id: '123',
          extendedInfo: { types: [], tags: [], commonNames: [] },
        }),
      );

      stubFetchResponse({
        id: '123',
        species: 'joeus minimus',
        cultivar: 'ugly boy',
        createdAt: '2030-11-11T00:00:00.000Z',
        updatedAt: '2030-11-11T00:00:00.000Z',
        extendedInfo: {
          types: ['tree', 'bush'],
          tags: ['wow'],
          commonNames: ['joes bush'],
        },
        description: '',
      });
    });

    it('updates the extendedInfo and saves the changes locally', async () => {
      await updateExtendedInfo('123', {
        tags: ['wow'],
        types: ['tree', 'bush'],
        commonNames: ['joes bush'],
      });

      assertEndPointCalled('https://www.dummy-api.com/plant');

      const savedDbData = await plantTable.toArray();

      expect(savedDbData).toEqual([
        {
          id: '123',
          species: 'joeus minimus',
          cultivar: 'ugly boy',
          createdAt: '2030-11-11T00:00:00.000Z',
          updatedAt: '2030-11-11T00:00:00.000Z',
          extendedInfo: {
            types: ['tree', 'bush'],
            tags: ['wow'],
            commonNames: ['joes bush'],
          },
          description: '',
        },
      ]);
    });
  });
});
