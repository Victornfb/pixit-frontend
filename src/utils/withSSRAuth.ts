import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import decode from 'jwt-decode';

type withSSRAuthOptions = {
  permissions?: string[];
  redirectTo?: string;
};

// High order function (função que retorna ou recebe uma função)
export function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options?: withSSRAuthOptions,
) {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P>> => {
    const destination = options?.redirectTo || '/';

    // Como é server side o primeiro parâmetro é o contexto (no client side é undefined)
    const cookies = parseCookies(ctx);

    const { token } = cookies;

    // Se não estiver logado e tentar acessar uma página que precisa estar logado, manda para o login
    if (!token) {
      return {
        redirect: {
          destination,
          permanent: false,
        },
      };
    }

    if (options) {
      const { exp } = decode<{ exp: number }>(token);
      const expirationDate = new Date(exp * 1000);

      if (!!token || expirationDate < new Date()) {
        destroyCookie(ctx, 'token');

        return {
          redirect: {
            destination,
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
