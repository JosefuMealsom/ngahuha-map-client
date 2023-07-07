import { describe, expect, it } from 'vitest';
import plantSiteFactory from '../test-helpers/factories/plant-site';
import { getPlantSitesWithinDistance } from './closest-plants.service';

describe('ClosestPlantsService', () => {
  // Positions obtained by selecting points on google maps,
  // Thankfully there is a distance scale on the map.
  const position = { latitude: -35.375587, longitude: 173.964963 };
  const closePlantSite1 = plantSiteFactory.create({
    latitude: -35.375563,
    longitude: 173.965043,
  });
  const closePlantSite2 = plantSiteFactory.create({
    latitude: -35.375506,
    longitude: 173.965156,
  });
  const farPlantSite = plantSiteFactory.create({
    latitude: -35.375204,
    longitude: 173.966025,
  });

  describe('getPlantSitesWithinDistance()', () => {
    it('returns the plants within a certain distance', async () => {
      expect(
        getPlantSitesWithinDistance(20, position, [
          closePlantSite1,
          closePlantSite2,
          farPlantSite,
        ]),
      ).toEqual([closePlantSite1, closePlantSite2]);
    });
  });
});
