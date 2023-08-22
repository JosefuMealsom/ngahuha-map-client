import { useAppStore } from '../../store/app.store';
import axiosClient from '../axios/axios-client';
import { loginLocally } from '../user.service';

export const login = async (email: string, password: string) => {
  await axiosClient.post('auth/login', {
    email: email,
    password: password,
  });

  loginLocally();
  useAppStore.getState().setLoggedIn(true);
};
