import { Injectable } from '@nestjs/common';
import { PureAbility, AbilityBuilder, ExtractSubjectType } from '@casl/ability';
import {
  createPrismaAbility,
  Subjects as PrismaSubjects,
  PrismaQuery,
} from '@casl/prisma';
import {
  Log,
  User,
  UserRole,
  UserRolePermission,
  UserGroup,
  Form,
  FormField,
  FormEntry,
  Event,
  EventGuest,
  Supplier,
} from '@prisma/client';

import { PrismaService } from '@/common';

import { AuthenticatedUser } from '../../types';

export enum Action {
  COUNT = 'count',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type Subjects = PrismaSubjects<{
  log: Log;
  user: User;
  userRole: UserRole;
  userRolePermission: UserRolePermission;
  userGroup: UserGroup;
  form: Form;
  formField: FormField;
  formEntry: FormEntry;
  event: Event;
  eventGuest: EventGuest;
  supplier: Supplier;
}>;

export type AppAbility = PureAbility<[Action, Subjects], PrismaQuery>;

@Injectable()
export class AbilityFactory {
  constructor(private prismaService: PrismaService) {}

  async build(user: AuthenticatedUser): Promise<AppAbility> {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

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

    permissions.forEach((permission) => {
      const [scope, action] = permission.action.split('::');

      can(action as Action, scope as ExtractSubjectType<Subjects>);
    });

    const ability = build();

    return ability;
  }
}

export default AbilityFactory;
