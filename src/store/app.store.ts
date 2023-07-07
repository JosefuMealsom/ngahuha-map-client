import { create } from 'zustand';
type AppSection =
  | 'ViewMap'
  | 'UploadPlants'
  | 'AddPlant'
  | 'ClosestPlantsToUser';
type AppState = {
  activeView: AppSection;
  setActiveView: (activeView: AppSection) => void;
};

export const useAppStore = create<AppState>((set) => {
  const setActiveView = (activeView: AppSection) => {
    set(() => {
      return { activeView: activeView };
    });
  };

  return {
    activeView: 'ViewMap',
    setActiveView: setActiveView,
  };
});
