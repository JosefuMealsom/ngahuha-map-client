import { create } from 'zustand';
import { LatLong } from '../types/lat-long.type';
import { Path, PathNode } from '../types/api/path.type';

type PathTracerStore = {
  path: LatLong[];
  savedPaths: { path: Path; pathNodes: PathNode[] }[];
  setPath: (path: LatLong[]) => any;
  addPathNode: (path: LatLong) => any;
  setSavedPaths: (paths: { path: Path; pathNodes: PathNode[] }[]) => any;
};

export const usePathTracerStore = create<PathTracerStore>((set) => {
  const setPath = (path: LatLong[]) => {
    set(() => {
      return { path: path };
    });
  };

  const addPathNode = (pathNode: LatLong) => {
    set((state) => {
      return { path: [...state.path, pathNode] };
    });
  };

  const setSavedPaths = (paths: { path: Path; pathNodes: PathNode[] }[]) => {
    set(() => {
      return { savedPaths: paths };
    });
  };

  return {
    path: [],
    savedPaths: [],
    setPath: setPath,
    addPathNode: addPathNode,
    setSavedPaths: setSavedPaths,
  };
});
