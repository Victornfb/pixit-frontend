import axios, { AxiosError } from 'axios';
import { destroyCookie, parseCookies } from 'nookies';
import { signOut } from '../contexts/AuthContext';

export function setupApiClient(ctx: any = undefined) {
  const cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });
  if (cookies.token) {
    api.defaults.headers.common.Authorization = `Bearer ${cookies.token}`;
  }

  // Execute every time a request is made
  api.interceptors.response.use(
    response => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (typeof window === 'undefined') {
          destroyCookie(ctx, 'nextauth.token');
          delete api.defaults.headers.common.Authorization;
        } else {
          signOut();
        }
      }
      return Promise.reject(error);
    },
  );

  return api;
}
