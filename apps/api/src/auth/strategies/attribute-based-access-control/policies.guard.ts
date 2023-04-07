import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Request } from 'express';
import { MongoAbility } from '@casl/ability';

import { CHECK_POLICIES_KEY } from '../../decorators';
import { JWT } from '../../types';

import { AbilityFactory } from './ability.factory';

export type Policies = {
  apiToken: { ANON: boolean; SERVICE: boolean };
  user: (ability: MongoAbility) => boolean;
};

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
    private prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest<Request>();

    const jwt = user as JWT | null;

    if (!jwt) throw new UnauthorizedException();

    if (jwt.type === 'api-token') {
      const policies = this.reflector.get<Policies | null>(
        CHECK_POLICIES_KEY,
        context.getHandler()
      );

      const apiToken = await this.prismaService.apiToken.findUnique({
        where: { id: jwt.apiToken.id },
      });

      if (!policies || !apiToken) return false;

      return policies.apiToken[apiToken.type];
    } else {
      const policies = this.reflector.get<Policies | null>(
        CHECK_POLICIES_KEY,
        context.getHandler()
      );

      const ability = await this.abilityFactory.build(jwt.user);

      if (!policies) return false;

      return policies.user(ability);
    }
  }
}

export default PoliciesGuard;
