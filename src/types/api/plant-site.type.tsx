export type PlantSite = {
  id?: string;
  speciesId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  createdAt?: Date;
  updatedAt?: Date;
};
