import { AxiosError } from 'axios';

type ErrorMessages = {
  [key: number]: string;
};

/**
 * Get error message from axios error
 * @param {unknown} e - thrown error
 * @param {ErrorMessages} errorMessages - specify error messages as an object (following errors are already set as default so you do not need to specify when using this function: 401, 403, 500)
 */
export default function getAxiosErrorMessage(
  e: unknown,
  errorMessages: ErrorMessages,
) {
  // set errors object with default error messages + messages passed on errorMessages param
  const errors = {
    401: 'Erro na autenticação',
    403: 'Permissão negada',
    500: 'Erro interno no servidor',
    ...errorMessages,
  } as ErrorMessages;

  const error = e as AxiosError;

  // check if axios error status/code is on object and if so return this message
  if (
    (error.response?.status || error.code) &&
    errors[Number(error.response?.status || error.code)]
  ) {
    return errors[Number(error.response?.status || error.code)];
  }

  // if message is not inside errors object return default message
  return error.message || 'Ocorreu um erro desconhecido';
}
