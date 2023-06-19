import { PlantSpecies } from './plant-species.type';

export type PlantSitePhoto = {
  id?: number;
  plantSiteId: string;
  filename: string;
  dataURL: string;
  species: PlantSpecies;
  latitude: number;
  longitude: number;
  accuracy: number;
};
