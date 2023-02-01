import { Injectable } from '@nestjs/common';
import { MongoAbility, createMongoAbility } from '@casl/ability';

import { PrismaService } from '@/prisma';

import { AuthenticatedUser } from '../../types';

@Injectable()
export class AbilityFactory {
  constructor(private prismaService: PrismaService) {}

  async build(user: AuthenticatedUser): Promise<MongoAbility> {
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

    return createMongoAbility(rules);
  }
}

export default AbilityFactory;
