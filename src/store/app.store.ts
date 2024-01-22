import { create } from 'zustand';
import { LatLong } from '../types/lat-long.type';

type SyncStatus = 'Not syncing' | 'Syncing data' | 'Syncing photos';

type AppStore = {
  setLoggedIn: (loggedInStatus: boolean) => void;
  setPosition: (position: LatLong | undefined) => void;
  setSearchQuery: (value: string) => void;
  setSyncStatus: (value: SyncStatus) => void;
  loggedIn: boolean;
  position?: LatLong;
  searchQuery: string;
  syncStatus: SyncStatus;
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
    set((draft) => {
      if (draft.searchQuery === value) return {};

      return { searchQuery: value };
    });
  };

  const setSyncStatus = (value: SyncStatus) => {
    set(() => {
      return { syncStatus: value };
    });
  };

  return {
    loggedIn: false,
    position: undefined,
    searchQuery: '',
    syncStatus: 'Not syncing',
    setLoggedIn: setLoggedIn,
    setPosition: setPosition,
    setSearchQuery: setSearchQuery,
    setSyncStatus: setSyncStatus,
  };
});
