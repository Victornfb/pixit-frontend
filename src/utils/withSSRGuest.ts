import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { parseCookies } from 'nookies';

import { api } from '../services/apiClient';

type WithSSRGuestOptions = {
  onlyGuest?: boolean;
};

const defaultOptions = { onlyGuest: false } as WithSSRGuestOptions;

// High order function (função que retorna ou recebe uma função)
export function withSSRGuest<P>(
  fn: GetServerSideProps<P>,
  options = defaultOptions,
) {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P>> => {
    // Como é server side o primeiro parâmetro é o contexto (no client side é undefined)
    const cookies = parseCookies(ctx);

    const { token } = cookies;

    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      if (options.onlyGuest) {
        return {
          redirect: {
            destination: '/list',
            permanent: false,
          },
        };
      }
    }

    try {
      return await fn(ctx);
    } catch (err) {
      // eslint-disable-next-line no-return-await
      return await fn(ctx);
    }
  };
}
