/* eslint-disable react-refresh/only-export-components */
import AuthService from '@api/http/services/AuthService';
import searchParams from '@helpers/searchParams';
import { AxiosError } from 'axios';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';

type TAuthContext = {
  authState: TLoginStatus;
  user: TUser | null;
  login: () => void;
  exit: () => void;
  redirect: () => void;
};

type TLoginStatus = 'logged' | 'pending' | 'logged-out' | 'server error' | 'expired link';

export const authContext = createContext<TAuthContext | null>(null);
const REDIRECT_URL = 'https://t.me/UmaficTargetBot';

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<TUser | null>(null);
  const [authState, setAuthState] = useState<TLoginStatus>('pending');
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));

  const removeAccessLinkParam = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('access_link');
    window.history.replaceState({}, document.title, url.toString());
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
  }, []);

  const exit = useCallback(() => {
    logout();
    setAuthState('logged-out');
  }, [logout]);

  const loginByToken = useCallback(async () => {
    try {
      const { data: user } = await AuthService.get_user();
      setUser(user);
      setAuthState('logged');
      removeAccessLinkParam();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          setAuthState('server error');
        } else {
          setAuthState('logged-out');
          logout();
        }
      }
    }
  }, [logout]);

  const loginByLink = useCallback(async () => {
    try {
      const access_link = searchParams('access_link');
      if (!access_link) {
        setAuthState('logged-out');
        return logout();
      }
      const { data: token } = await AuthService.get_access_token(access_link);
      localStorage.setItem('access_token', token.access_token);
      setToken(token.access_token);
      const { data: user } = await AuthService.get_user();
      setUser(user);
      setAuthState('logged');
      removeAccessLinkParam();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          setAuthState('server error');
        } else {
          setAuthState('expired link');
          logout();
        }
      }
    }
  }, [logout]);

  const login = useCallback(async () => {
    try {
      if (token) await loginByToken();
      if (!token) await loginByLink();
    } catch {
      setAuthState('logged-out');
      logout();
    }
  }, [token, loginByToken, loginByLink, logout]);

  const redirect = useCallback(() => {
    window.location.href = REDIRECT_URL;
  }, []);

  useEffect(() => {
    if (!authState || authState === 'pending') {
      login();
    }
  }, [authState, login]);

  return <authContext.Provider value={{ user, authState, login, redirect, exit }}>{children}</authContext.Provider>;
}
export function useAuth() {
  const context = useContext(authContext);

  if (!context) throw new Error('Отсутствует провайдер AuthProvider');
  return context;
}
