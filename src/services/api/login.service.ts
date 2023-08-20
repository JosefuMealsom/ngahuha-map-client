import { getFullApiPath } from '../../utils/api-url.util';

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
};
