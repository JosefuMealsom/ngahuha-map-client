import { create } from 'zustand';
import { MapState } from '../types/map-state.type';

type MapStore = MapState & {
  setPan: (x: number, y: number) => void;
  setZoom: (zoom: number) => void;
};

export const useMapStore = create<MapStore>((set) => {
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
    mapBounds: {
      lat: [-35.373941, -35.378587],
      long: [173.96343, 173.967164],
    },
    canvasDimensions: { width: 432 * scale, height: 657 * scale },
    setPan: setPan,
    setZoom: setZoom,
  };
});
