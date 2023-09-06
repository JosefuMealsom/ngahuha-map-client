export type Path = {
  id?: number;
  name: string;
};

export type PathNode = {
  id?: number;
  order: number;
  pathId: number;
  latitude: number;
  longitude: number;
  accuracy: number;
};
