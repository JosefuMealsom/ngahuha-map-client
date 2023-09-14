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

  const x = window.innerWidth / 2 - 576 / 2 / (window.innerHeight / 876);

  return {
    pan: { x: x, y: 0 },
    zoom: 2,
    mapBounds: {
      lat: [-35.373941, -35.378587],
      long: [173.96343, 173.967164],
    },
    canvasDimensions: { width: 576, height: 876 },
    setPan: setPan,
    setZoom: setZoom,
  };
});
