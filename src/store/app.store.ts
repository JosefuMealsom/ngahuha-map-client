import { create } from 'zustand';
import { LatLong } from '../types/lat-long.type';

type SyncStatus = 'Not syncing' | 'Syncing data' | 'Syncing photos';

type AppStore = {
  setLoggedIn: (loggedInStatus: boolean) => void;
  setPosition: (position: LatLong | undefined) => void;
  setSearchQuery: (value: string) => void;
  setSyncStatus: (value: SyncStatus) => void;
  setMapCarouselPosition: (value: number) => void;
  loggedIn: boolean;
  position?: LatLong;
  searchQuery: string;
  syncStatus: SyncStatus;
  mapCarouselPosition: number;
};

export const useAppStore = create<AppStore>((set) => {
  const setLoggedIn = (loggedInStatus: boolean) => {
    set(() => {
      return { loggedIn: loggedInStatus };
    });
  };

  const setPosition = (position: LatLong | undefined) => {
    set(() => {
      return { position: position };
    });
  };

  const setSearchQuery = (value: string) => {
    set(() => {
      return { searchQuery: value };
    });
  };

  const setSyncStatus = (value: SyncStatus) => {
    set(() => {
      return { syncStatus: value };
    });
  };

  const setMapCarouselPosition = (value: number) => {
    set(() => {
      return { mapCarouselPosition: value };
    });
  };

  return {
    loggedIn: false,
    position: undefined,
    searchQuery: '',
    syncStatus: 'Not syncing',
    mapCarouselPosition: 0,
    setLoggedIn: setLoggedIn,
    setPosition: setPosition,
    setSearchQuery: setSearchQuery,
    setSyncStatus: setSyncStatus,
    setMapCarouselPosition: setMapCarouselPosition,
  };
});
