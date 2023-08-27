import { create } from 'zustand';
import { LatLong } from '../types/lat-long.type';

type AppStore = {
  setLoggedIn: (loggedInStatus: boolean) => void;
  setPosition: (position: LatLong | undefined) => void;
  loggedIn: boolean;
  position?: LatLong;
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

  return {
    loggedIn: false,
    position: undefined,
    setLoggedIn: setLoggedIn,
    setPosition: setPosition,
  };
});
