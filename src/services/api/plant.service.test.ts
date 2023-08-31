import 'fake-indexeddb/auto';
import { expect, describe, it, afterEach, beforeEach } from 'vitest';
import { plantTable } from '../offline.database';
import { mockApiCall } from '../../test-helpers/fetch-stub';
import {
  createPlant,
  fetchPlants,
  syncPlantsOffline,
  updatePlant,
} from './plant.service';
import plantFactory from '../../test-helpers/factories/plant';
import { getFullApiPath } from '../../utils/api-url.util';

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
      mockApiCall(getFullApiPath('plant'), [plant1, plant2]);
      const plants = await fetchPlants();

      expect(plants).toEqual([
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
      mockApiCall(getFullApiPath('plant'), [plant1, plant2]);

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

        mockApiCall(getFullApiPath('plant'), [
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
      mockApiCall(getFullApiPath('plant'), plant1, 'post');

      await createPlant({
        species: 'joeus maximus',
        cultivar: 'pretty lady',
        description: 'Wow very descriptive!',
        extendedInfo: { types: [], tags: [], commonNames: [] },
      });

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

  describe('updatePlant()', () => {
    beforeEach(async () => {
      await plantTable.add(
        plantFactory.create({
          id: '123',
          extendedInfo: { types: [], tags: [], commonNames: [] },
        }),
      );

      mockApiCall(
        getFullApiPath('plant/123'),
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
          description: 'awesome!',
        },
        'patch',
      );
    });

    it('updates the plant and saves the changes locally', async () => {
      await updatePlant('123', {
        species: 'joeus minimus',
        cultivar: 'ugly boy',
        description: 'awesome!',
        extendedInfo: {
          tags: ['wow'],
          types: ['tree', 'bush'],
          commonNames: ['joes bush'],
        },
      });

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
          description: 'awesome!',
        },
      ]);
    });
  });
});
