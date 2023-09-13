import { describe, expect, it } from 'vitest';
import plantFactory from '../../test-helpers/factories/plant';
import plantSiteFactory from '../../test-helpers/factories/plant-site';
import { MapSearchFilter } from './map-search-filter';

describe('SearchPlantSitesFilter', () => {
  const plant1 = plantFactory.create({
    id: '123',
    species: 'hello',
    cultivar: 'joe',
    extendedInfo: { types: ['tree'], commonNames: ["Jeffrey's bush"] },
  });
  const plant2 = plantFactory.create({
    id: 'abc',
    species: 'goodbye',
    cultivar: 'moe',
    extendedInfo: { types: ['mushroom'], commonNames: ["Barry's cactus"] },
  });

  const plantSite1 = plantSiteFactory.create({ id: 'aaa', plantId: '123' });
  const plantSite2 = plantSiteFactory.create({ id: 'bbb', plantId: 'abc' });

  describe('search()', () => {
    it('searches the plant species and returns the results with the correct description', async () => {
      const searchPlantsFilter = new MapSearchFilter(
        [plantSite1, plantSite2],
        [plant1, plant2],
      );

      expect(searchPlantsFilter.search('hello')).toEqual([
        {
          description: 'aaa',
          data: expect.objectContaining({ id: 'aaa', plantId: '123' }),
        },
      ]);
    });

    it('does not return any results if the search string is empty', () => {
      const searchPlantsFilter = new MapSearchFilter(
        [plantSite1, plantSite2],
        [plant1, plant2],
      );

      expect(searchPlantsFilter.search('')).toEqual([]);
    });
  });
});
