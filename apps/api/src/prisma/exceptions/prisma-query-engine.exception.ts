import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function translatePrismaErrorCode(
  error: Prisma.PrismaClientKnownRequestError
): string | string[] {
  switch (error.code) {
    case 'P2002': {
      if (error.meta?.target) {
        const targets = error.meta.target as string[];

        return targets.map((target) => `${target} is already taken`);
      }

      return 'At least one field is already taken';
    }

    default:
      return 'Bad Request';
  }
}

export class PrismaQueryEngineException extends HttpException {
  constructor(
    exception:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientUnknownRequestError
      | Prisma.PrismaClientValidationError
      | Prisma.NotFoundError
  ) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      super(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: translatePrismaErrorCode(exception),
        },
        HttpStatus.BAD_REQUEST
      );
    }

    if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      super(exception.message, HttpStatus.BAD_REQUEST);
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      super(exception.message, HttpStatus.BAD_REQUEST);
    }

    if (exception instanceof Prisma.NotFoundError) {
      super('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}

export default PrismaQueryEngineException;
