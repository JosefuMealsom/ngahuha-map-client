import { describe, expect, it } from 'vitest';
import { SearchPlantsFilter } from './search-plants.filter';
import plantFactory from '../../test-helpers/factories/plant';

describe('SearchPlantsFilter', () => {
  const plant1 = plantFactory.create({
    id: '123',
    species: 'hello',
    cultivar: 'joe',
    createdAt: '1988-11-11T00:00:00.000Z',
    updatedAt: '1988-11-11T00:00:00.000Z',
    extendedInfo: { type: ['tree'], commonNames: ["Jeffrey's bush"] },
  });
  const plant2 = plantFactory.create({
    id: 'abc',
    species: 'goodbye',
    cultivar: 'moe',
    createdAt: '1988-11-11T00:00:00.000Z',
    updatedAt: '1988-11-11T00:00:00.000Z',
    extendedInfo: { type: ['mushroom'], commonNames: ["Barry's cactus"] },
  });

  describe('search()', () => {
    it('searches the plant species and returns the results with the correect description', async () => {
      const searchPlantsFilter = new SearchPlantsFilter([plant1, plant2]);

      expect(searchPlantsFilter.search('hello')).toEqual([
        {
          description: "hello 'joe'",
          data: {
            id: '123',
            species: 'hello',
            cultivar: 'joe',
            createdAt: '1988-11-11T00:00:00.000Z',
            updatedAt: '1988-11-11T00:00:00.000Z',
            extendedInfo: { type: ['tree'], commonNames: ["Jeffrey's bush"] },
          },
        },
      ]);
    });

    it('searches the plant cultivar and returns the results', async () => {
      const searchPlantsFilter = new SearchPlantsFilter([plant1, plant2]);

      expect(searchPlantsFilter.search('moe')).toEqual([
        {
          description: "goodbye 'moe'",
          data: {
            id: 'abc',
            species: 'goodbye',
            cultivar: 'moe',
            createdAt: '1988-11-11T00:00:00.000Z',
            updatedAt: '1988-11-11T00:00:00.000Z',
            extendedInfo: {
              type: ['mushroom'],
              commonNames: ["Barry's cactus"],
            },
          },
        },
      ]);
    });

    it('searches the plants extended info for results', async () => {
      const searchPlantsFilter = new SearchPlantsFilter([plant1, plant2]);

      expect(searchPlantsFilter.search("Jeffrey's bush")).toEqual([
        {
          description: "hello 'joe'",
          data: {
            id: '123',
            species: 'hello',
            cultivar: 'joe',
            createdAt: '1988-11-11T00:00:00.000Z',
            updatedAt: '1988-11-11T00:00:00.000Z',
            extendedInfo: { type: ['tree'], commonNames: ["Jeffrey's bush"] },
          },
        },
      ]);

      expect(searchPlantsFilter.search('mush')).toEqual([
        {
          description: "goodbye 'moe'",
          data: {
            id: 'abc',
            species: 'goodbye',
            cultivar: 'moe',
            createdAt: '1988-11-11T00:00:00.000Z',
            updatedAt: '1988-11-11T00:00:00.000Z',
            extendedInfo: {
              type: ['mushroom'],
              commonNames: ["Barry's cactus"],
            },
          },
        },
      ]);
    });

    it('returns all the plants when the search is an empty string', async () => {
      const searchPlantsFilter = new SearchPlantsFilter([plant1, plant2]);

      expect(searchPlantsFilter.search('')).toEqual([
        {
          description: "hello 'joe'",
          data: {
            id: '123',
            species: 'hello',
            cultivar: 'joe',
            createdAt: '1988-11-11T00:00:00.000Z',
            updatedAt: '1988-11-11T00:00:00.000Z',
            extendedInfo: { type: ['tree'], commonNames: ["Jeffrey's bush"] },
          },
        },
        {
          description: "goodbye 'moe'",
          data: {
            id: 'abc',
            species: 'goodbye',
            cultivar: 'moe',
            createdAt: '1988-11-11T00:00:00.000Z',
            updatedAt: '1988-11-11T00:00:00.000Z',
            extendedInfo: {
              type: ['mushroom'],
              commonNames: ["Barry's cactus"],
            },
          },
        },
      ]);
    });
  });
});
