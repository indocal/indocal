import { BaseExceptionFilter } from '@nestjs/core';
import { Catch, ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import PrismaQueryEngineException from './prisma-query-engine.exception';

@Catch()
export class PrismaFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    if (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError ||
      exception instanceof Prisma.PrismaClientValidationError ||
      exception instanceof Prisma.NotFoundError
    ) {
      return super.catch(new PrismaQueryEngineException(exception), host);
    } else {
      return super.catch(exception, host);
    }
  }
}

export default PrismaFilter;
