import { describe, expect, it } from 'vitest';
import plantFactory from '../../test-helpers/factories/plant';
import plantSiteFactory from '../../test-helpers/factories/plant-site';
import { SearchPlantSitesFilter } from './search-plant-sites.filter';
import { PlantSiteWithinDistance } from '../../types/api/plant-site.type';

describe('SearchPlantSitesFilter', () => {
  const plant1 = plantFactory.create({
    id: '123',
    species: 'hello',
    cultivar: 'joe',
    extendedInfo: { type: ['tree'], commonNames: ["Jeffrey's bush"] },
  });
  const plant2 = plantFactory.create({
    id: 'abc',
    species: 'goodbye',
    cultivar: 'moe',
    extendedInfo: { type: ['mushroom'], commonNames: ["Barry's cactus"] },
  });

  const plantSite1 = plantSiteFactory.create({ id: 'aaa', plantId: '123' });
  const plantSite2 = plantSiteFactory.create({ id: 'bbb', plantId: 'abc' });

  describe('search()', () => {
    it('searches the plant species and returns the results with the correct description', async () => {
      const searchPlantsFilter = new SearchPlantSitesFilter(
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

    it('searches the plant cultivar and returns the valid plant sites', async () => {
      const searchPlantsFilter = new SearchPlantSitesFilter(
        [plantSite1, plantSite2],
        [plant1, plant2],
      );

      expect(searchPlantsFilter.search('moe')).toEqual([
        {
          description: 'bbb',
          data: expect.objectContaining({ id: 'bbb', plantId: 'abc' }),
        },
      ]);
    });

    it('searches the plant tags and returns the valid plant sites', async () => {
      const searchPlantsFilter = new SearchPlantSitesFilter(
        [plantSite1, plantSite2],
        [plant1, plant2],
      );

      expect(searchPlantsFilter.search("Barry's cactus")).toEqual([
        {
          description: 'bbb',
          data: expect.objectContaining({ id: 'bbb', plantId: 'abc' }),
        },
      ]);
    });

    it('can search and return sub classes of plant sites that have added properties', async () => {
      const searchPlantsFilter =
        new SearchPlantSitesFilter<PlantSiteWithinDistance>(
          [
            Object.assign(plantSite1, { distance: 10 }),
            Object.assign(plantSite2, { distance: 20 }),
          ],
          [plant1, plant2],
        );

      expect(searchPlantsFilter.search("Barry's cactus")).toEqual([
        {
          description: 'bbb',
          data: expect.objectContaining({
            id: 'bbb',
            plantId: 'abc',
            distance: 20,
          }),
        },
      ]);
    });
  });
});
