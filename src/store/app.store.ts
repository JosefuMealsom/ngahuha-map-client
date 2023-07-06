import { create } from 'zustand';
type AppSection = 'ViewMap' | 'UploadPlants' | 'AddPlant';
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
