import { create } from 'zustand';
import { MapBounds } from '../types/map-bounds.type';

interface MapState {
  pan: { x: number; y: number };
  zoom: number;
  viewBounds: MapBounds;
  mapBounds: MapBounds;
  canvasDimensions: { width: number; height: number };

  setPan: (x: number, y: number) => void;
  setZoom: (zoom: number) => void;
}

export const useMapStore = create<MapState>((set) => {
  const setPan = (x: number, y: number) => {
    set(() => {
      return { pan: { x: x, y: y } };
    });
  };

  const setZoom = (zoom: number) => {
    set(() => {
      return { zoom: zoom };
    });
  };

  const scale = 2;

  return {
    pan: { x: 0, y: 0 },
    zoom: 1,
    viewBounds: {
      lat: [-35.373941, -35.378587],
      long: [173.96343, 173.967164],
    },
    mapBounds: {
      lat: [-35.373941, -35.378587],
      long: [173.96343, 173.967164],
    },
    canvasDimensions: { width: 432 * scale, height: 657 * scale },
    setPan: setPan,
    setZoom: setZoom,
  };
});
