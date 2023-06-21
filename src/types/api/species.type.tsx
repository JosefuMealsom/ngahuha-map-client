export type Species = {
  id: string;
  genusId: string;
  typeId: string;
  name: string;
  cultivar?: string;
  commonNames?: string[];
};
