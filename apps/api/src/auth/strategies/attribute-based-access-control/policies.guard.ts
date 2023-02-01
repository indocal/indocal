import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { MongoAbility } from '@casl/ability';

import { CHECK_POLICIES_KEY } from '../../decorators';
import { AuthenticatedUser } from '../../types';

import { AbilityFactory } from './ability.factory';

export interface PolicyHandler {
  handle(ability: MongoAbility): boolean;
}

export type PolicyHandlerCallback = (ability: MongoAbility) => boolean;

export type Policy = PolicyHandler | PolicyHandlerCallback;

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory
  ) {}

  async canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest<Request>();

    if (!user) throw new UnauthorizedException();

    const ability = await this.abilityFactory.build(user as AuthenticatedUser);

    const policies =
      this.reflector.get<Policy[]>(CHECK_POLICIES_KEY, context.getHandler()) ||
      [];

    return policies.every((handler) =>
      typeof handler === 'function' ? handler(ability) : handler.handle(ability)
    );
  }
}

export default PoliciesGuard;
