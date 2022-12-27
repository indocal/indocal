import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthenticatedUser } from '@/auth';

import LoggingService from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private loggingService: LoggingService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<unknown>> {
    const startsAt = Date.now();

    const controller = context.getClass().name;
    const handler = context.getHandler().name;

    const { method, params, body, user } = context
      .switchToHttp()
      .getRequest<Request>();

    const logger = new Logger(controller);

    await this.loggingService.log(
      controller,
      `${method}::${handler}`,
      (user as AuthenticatedUser) || null,
      { params, body }
    );

    const total = '\x1b[33m' + `+${Date.now() - startsAt}ms`;

    return next
      .handle()
      .pipe(tap(() => logger.log(`${method} -> ${handler} ${total}`)));
  }
}

export default LoggingInterceptor;
