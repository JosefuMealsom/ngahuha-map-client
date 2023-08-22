import { useAppStore } from '../../store/app.store';
import { getFullApiPath } from '../../utils/api-url.util';
import { loginLocally } from '../user.service';

export const login = async (email: string, password: string) => {
  const loginResponse = await fetch(getFullApiPath('auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email: email, password: password }),
  });

  if (!loginResponse.ok) {
    throw Error(
      `Login failed: ${loginResponse.status}, ${
        (await loginResponse.json()).message
      }`,
    );
  }

  loginLocally();
  useAppStore.getState().setLoggedIn(true);
};
