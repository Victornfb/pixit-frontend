/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable consistent-return */
import { createContext, ReactNode, useEffect, useState } from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import Router from 'next/router';
import decode from 'jwt-decode';
import { api } from '../services/apiClient';

type User = {
  id: number;
  name: string;
  email: string;
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  user?: User;
  isAuthenticated: boolean;
  setUser: (user: User | undefined) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, 'token');
  Router.push('/');
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  useEffect(() => {
    const { token } = parseCookies();

    if (!token) {
      return;
    }

    const { exp } = decode<{ exp: number }>(token);
    const expirationDate = new Date(exp * 1000);

    if (!token || expirationDate <= new Date()) {
      destroyCookie(undefined, 'token');
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password,
      });

      const { user: userData, token } = response.data;

      setCookie(undefined, 'token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
      setUser(userData);

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      Router.push('/list');
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  }

  return (
    <AuthContext.Provider
      value={{ signIn, signOut, isAuthenticated, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
