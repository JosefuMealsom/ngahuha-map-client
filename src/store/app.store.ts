import { create } from 'zustand';
import { LatLong } from '../types/lat-long.type';

type AppStore = {
  setLoggedIn: (loggedInStatus: boolean) => void;
  setPosition: (position: LatLong | undefined) => void;
  setSearchQuery: (value: string) => void;
  loggedIn: boolean;
  position?: LatLong;
  searchQuery: string;
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

  return {
    loggedIn: false,
    position: undefined,
    searchQuery: '',
    setLoggedIn: setLoggedIn,
    setPosition: setPosition,
    setSearchQuery: setSearchQuery,
  };
});
