export type Plant = {
  id: string;
  species: string;
  cultivar?: string;
  createdAt: string;
  updatedAt: string;
  extendedInfo?: { [key: string]: any };
  description?: string;
};
