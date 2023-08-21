import { create } from 'zustand';

type AppStore = {
  setLoggedIn: (loggedInStatus: boolean) => void;
  loggedIn: boolean;
};

export const useAppStore = create<AppStore>((set) => {
  const setLoggedIn = (loggedInStatus: boolean) => {
    set(() => {
      return { loggedIn: loggedInStatus };
    });
  };

  return {
    loggedIn: false,
    setLoggedIn: setLoggedIn,
  };
});
