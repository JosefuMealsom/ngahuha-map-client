export type PlantSite = {
  id: string;
  plantId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  createdAt: string;
  updatedAt: string;
};

export type PlantSiteWithinDistance = PlantSite & { distance: number };
