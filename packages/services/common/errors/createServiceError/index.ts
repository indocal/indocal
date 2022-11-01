import axios from 'axios';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import ServiceError from '../ServiceError';

export function createServiceError(error: unknown): ServiceError {
  if (error instanceof axios.AxiosError) {
    if (error.response?.data) {
      return new ServiceError({
        status:
          'statusCode' in error.response.data
            ? error.response.data.statusCode
            : error.status
            ? Number(error.status)
            : StatusCodes.INTERNAL_SERVER_ERROR,

        type:
          'error' in error.response.data
            ? error.response.data.error
            : error.name,

        message:
          'message' in error.response.data &&
          typeof error.response.data.message === 'string'
            ? error.response.data.message
            : error.message,

        ...('message' in error.response.data &&
          Array.isArray(error.response.data.message) &&
          error.response.data.message.every(
            (detail: unknown) => typeof detail === 'string'
          ) && {
            details: error.response.data.message,
          }),

        options: { cause: error },
      });
    }

    return new ServiceError({
      status: error.status
        ? Number(error.status)
        : StatusCodes.INTERNAL_SERVER_ERROR,

      type: StatusCodes[StatusCodes.INTERNAL_SERVER_ERROR],
      message: error.message,
      options: { cause: error },
    });
  }

  if (error instanceof Error) {
    return new ServiceError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      type: StatusCodes[StatusCodes.INTERNAL_SERVER_ERROR],
      message: error.message,
      options: { cause: error },
    });
  }

  return new ServiceError({
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    type: StatusCodes[StatusCodes.INTERNAL_SERVER_ERROR],
    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
  });
}

export default createServiceError;
