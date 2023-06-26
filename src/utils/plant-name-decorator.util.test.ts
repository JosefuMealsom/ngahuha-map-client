import { expect, describe, it } from 'vitest';
import { getFullPlantName } from './plant-name-decorator.util';
import plantFactory from '../test-helpers/factories/plant';

describe('PlantNameDecorator', () => {
  describe('getFullPlantName()', () => {
    it('generates the full plant name correctly', async () => {
      const plant = plantFactory.create({
        species: 'Joeus maximus',
        cultivar: 'Pretty lady',
      });

      expect(getFullPlantName(plant)).toEqual("Joeus maximus 'Pretty lady'");
    });

    it('generates the names of plants that are not cultivars properly', async () => {
      const plant = plantFactory.create({
        species: 'Joeus maximus',
        cultivar: '',
      });

      expect(getFullPlantName(plant)).toEqual('Joeus maximus');
    });
  });
});
