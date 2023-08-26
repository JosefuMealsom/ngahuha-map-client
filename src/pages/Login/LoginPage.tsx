import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { login } from '../../services/api/login.service';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [emailValue, setEmailValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const navigate = useNavigate();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!emailValue || !passwordValue) {
      return;
    }

    try {
      await login(emailValue, passwordValue);
      toast('Sucessfully logged in');

      navigate('/', { replace: true });
    } catch (error) {
      toast(`There was an error logging in: ${(error as Error).message}`);
    }
  }

  return (
    <div className="flex justify-center items-center w-full pt-40">
      <div>
        <h1 className="font-bold mb-5 text-inverted-background text-xl">
          Login
        </h1>
        <form onSubmit={onSubmit}>
          <label className="mb-2 text-inverted-background text-sm font-bold block">
            Email
          </label>
          <input
            type="email"
            className="w-full py-2 px-4 border font-light border-gray-400 rounded-full mb-5"
            placeholder="Email"
            value={emailValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setEmailValue(event.target.value)
            }
            data-cy="login-email-input"
          />
          <label className="mb-2 text-inverted-background text-sm font-bold block">
            Password
          </label>
          <input
            type="password"
            className="w-full py-2 px-4 border font-light border-gray-400 rounded-full mb-5"
            placeholder="Password"
            value={passwordValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPasswordValue(event.target.value)
            }
            data-cy="login-password-input"
          />
          <div className="pb-10">
            <input
              className="block border-solid border px-4 py-2 text-sm rounded-full bg-sky-600
        font-semibold text-white hover:bg-gray-300 cursor-pointer"
              type="submit"
              data-cy="login-button"
              value="Login"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
