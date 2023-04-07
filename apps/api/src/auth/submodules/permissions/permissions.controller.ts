import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserRolePermission, UserRole } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';

import { PoliciesGuard } from '../../strategies/attribute-based-access-control';
import { CheckPolicies } from '../../decorators/check-policies.decorator';

import { UserRoleEntity } from '../roles/entities';

import { UserRolePermissionEntity } from './entities';

class EnhancedUserRolePermission extends UserRolePermissionEntity {
  role: UserRoleEntity;
}

type CreateEnhancedUserRolePermission = UserRolePermission & {
  role: UserRole;
};

@Controller()
@UseGuards(PoliciesGuard)
export class UsersRolesPermissionsController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedUserRolePermission({
    role,
    ...rest
  }: CreateEnhancedUserRolePermission): EnhancedUserRolePermission {
    const permission = new EnhancedUserRolePermission(rest);
    permission.role = new UserRoleEntity(role);

    return permission;
  }

  @Get('auth/roles/:role_id/permissions/count')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: false },
    user: (ability) => ability.can('count', 'userRole'),
  })
  async count(@Param('role_id') roleId: UUID): Promise<number> {
    return await this.prismaService.userRolePermission.count({
      where: { role: { id: roleId } },
    });
  }

  @Get('auth/roles/:role_id/permissions')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: false },
    user: (ability) => ability.can('read', 'userRole'),
  })
  async findAll(
    @Param('role_id') roleId: UUID
  ): Promise<MultipleEntitiesResponse<EnhancedUserRolePermission>> {
    const [permissions, count] = await this.prismaService.$transaction([
      this.prismaService.userRolePermission.findMany({
        where: { role: { id: roleId } },
        include: { role: true },
      }),
      this.prismaService.userRolePermission.count({
        where: { role: { id: roleId } },
      }),
    ]);

    return {
      count,
      entities: permissions.map((permission) =>
        this.createEnhancedUserRolePermission(permission)
      ),
    };
  }

  @Get('auth/roles/permissions/:id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: false },
    user: (ability) => ability.can('read', 'userRole'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedUserRolePermission | null>> {
    const permission = await this.prismaService.userRolePermission.findUnique({
      where: { id },
      include: { role: true },
    });

    return permission
      ? this.createEnhancedUserRolePermission(permission)
      : null;
  }
}

export default UsersRolesPermissionsController;
