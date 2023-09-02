export type PlantSitePhoto = {
  id: string;
  plantSiteId: string;
  data?: ArrayBuffer;
  createdAt: string;
  updatedAt: string;
  url: string;
  metadata?: { [key: string]: any };
};
