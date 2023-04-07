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

import { JWT } from '@/auth';

import LoggingService from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private loggingService: LoggingService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<unknown>> {
    const startsAt = Date.now();

    const type = context.getType();
    const controller = context.getClass().name;
    const handler = context.getHandler().name;

    switch (type) {
      case 'http': {
        const {
          method,
          params,
          query,
          body,
          user: jwt,
        } = context.switchToHttp().getRequest<Request>();

        await this.loggingService.log({
          context: controller,
          action: `${method}::${handler}`,
          jwt: jwt as JWT | null,
          metadata: {
            contextType: type,
            ...(Object.entries(params).length > 0 && { params }),
            ...(Object.entries(query).length > 0 && { query }),
            ...(Object.entries(body).length > 0 && { body }),
          },
        });
      }
    }

    return next.handle().pipe(
      tap(() => {
        const logger = new Logger(controller);

        const duration = '\x1b[33m' + `+${Date.now() - startsAt}ms`;

        logger.log(`(${type.toUpperCase()}) -> ${handler} ${duration}`);
      })
    );
  }
}

export default LoggingInterceptor;
