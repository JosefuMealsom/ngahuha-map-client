type CreatePlantData = {
  species: string;
  cultivar: string;
  description: string;
  extendedInfo: { tags: string[]; types: string[]; commonNames: string[] };
};
