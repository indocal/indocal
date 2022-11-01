import { Reflector } from '@nestjs/core';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SKIP_AUTHENTICATION_KEY } from '../../decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const wasSkipAuthKeySetted = this.reflector.getAllAndOverride<boolean>(
      SKIP_AUTHENTICATION_KEY,
      [context.getHandler(), context.getClass()]
    );

    return wasSkipAuthKeySetted || super.canActivate(context);
  }
}

export default JwtAuthGuard;
