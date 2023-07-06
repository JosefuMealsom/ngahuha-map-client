import { MapBounds } from './map-bounds.type';

export type MapState = {
  pan: { x: number; y: number };
  zoom: number;
  mapBounds: MapBounds;
  canvasDimensions: { width: number; height: number };
};
