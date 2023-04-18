import { Injectable } from '@nestjs/common';
import {
  createMongoAbility,
  MongoAbility,
  AbilityTuple,
  MongoQuery,
} from '@casl/ability';
import { PrismaService } from 'nestjs-prisma';

import { AuthenticatedUser } from '../../types';

export type AppAbility = MongoAbility<AbilityTuple, MongoQuery>;

@Injectable()
export class AbilityFactory {
  constructor(private prismaService: PrismaService) {}

  async build(user: AuthenticatedUser): Promise<AppAbility> {
    const permissions = await this.prismaService.userRolePermission.findMany({
      where: {
        role: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      },
    });

    const rules = permissions
      .map((permission) => {
        const [scope, action] = permission.action.split('::');

        return { action, subject: scope };
      })
      .flat();

    return createMongoAbility<AppAbility>(rules);
  }
}

export default AbilityFactory;
