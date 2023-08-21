import Cookies from 'js-cookie';
import { useAppStore } from '../store/app.store';

export const loginLocally = () => {
  useAppStore.getState().setLoggedIn(true);
  updateUserStateFromCookie(true);
};

export const logoutLocally = () => {
  useAppStore.getState().setLoggedIn(false);
  Cookies.remove('loggedIn');
};

export const readUserStateFromCookie = () => {
  if (Cookies.get('loggedIn') === 'true') {
    loginLocally();
  }
};

const updateUserStateFromCookie = (loggedIn: boolean) => {
  Cookies.set('loggedIn', loggedIn.toString());
};
