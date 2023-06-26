import type { Plant } from '../types/api/plant.type';

export const getFullPlantName = (plant: Plant) => {
  if (plant.cultivar) {
    return `${plant.species} '${plant.cultivar}'`;
  }
  return plant.species;
};
