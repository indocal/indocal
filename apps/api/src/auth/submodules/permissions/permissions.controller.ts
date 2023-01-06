import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import { PrismaService, UUID } from '@/common';
import { UserRoleEntity } from '@/auth';

import {
  PoliciesGuard,
  Action,
} from '../../strategies/attribute-based-access-control';
import { CheckPolicies } from '../../decorators/check-policies.decorator';

import { UserRolePermissionEntity } from './entities';
import {
  CreateUserRolePermissionDto,
  UpdateUserRolePermissionDto,
} from './dto';

class EnhancedUserRolePermission extends UserRolePermissionEntity {
  role: UserRoleEntity;
}

@Controller()
@UseGuards(PoliciesGuard)
export class UsersRolesPermissionsController {
  constructor(private prismaService: PrismaService) {}

  @Post('auth/roles/:role_id/permissions')
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'userRolePermission'))
  async create(
    @Param('role_id') roleId: UUID,
    @Body() createPermissionDto: CreateUserRolePermissionDto
  ): Promise<EnhancedUserRolePermission> {
    const { role, ...rest } =
      await this.prismaService.userRolePermission.create({
        data: {
          action: createPermissionDto.action,
          role: { connect: { id: roleId } },
        },
        include: { role: true },
      });

    const permission = new EnhancedUserRolePermission(rest);
    permission.role = new UserRoleEntity(role);

    return permission;
  }

  @Get('auth/roles/:role_id/permissions/count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'userRolePermission'))
  async count(@Param('role_id') roleId: UUID): Promise<number> {
    return await this.prismaService.userRolePermission.count({
      where: { role: { id: roleId } },
    });
  }

  @Get('auth/roles/:role_id/permissions')
  @CheckPolicies((ability) => ability.can(Action.READ, 'userRolePermission'))
  async findAll(
    @Param('role_id') roleId: UUID
  ): Promise<EnhancedUserRolePermission[]> {
    const permissions = await this.prismaService.userRolePermission.findMany({
      where: { role: { id: roleId } },
      include: { role: true },
    });

    return permissions.map(({ role, ...rest }) => {
      const permission = new EnhancedUserRolePermission(rest);
      permission.role = new UserRoleEntity(role);

      return permission;
    });
  }

  @Get('auth/roles/permissions/:id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'userRolePermission'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<EnhancedUserRolePermission | null> {
    const response = await this.prismaService.userRolePermission.findUnique({
      where: { id },
      include: { role: true },
    });

    if (response) {
      const { role, ...rest } = response;

      const permission = new EnhancedUserRolePermission(rest);
      permission.role = new UserRoleEntity(role);

      return permission;
    }

    return null;
  }

  @Patch('auth/roles/permissions/:id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'userRolePermission'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updatePermissionDto: UpdateUserRolePermissionDto
  ): Promise<EnhancedUserRolePermission> {
    const { role, ...rest } =
      await this.prismaService.userRolePermission.update({
        where: { id },
        data: { action: updatePermissionDto.action },
        include: { role: true },
      });

    const permission = new EnhancedUserRolePermission(rest);
    permission.role = new UserRoleEntity(role);

    return permission;
  }

  @Delete('auth/roles/permissions/:id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'userRolePermission'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<EnhancedUserRolePermission> {
    const { role, ...rest } =
      await this.prismaService.userRolePermission.delete({
        where: { id },
        include: { role: true },
      });

    const permission = new EnhancedUserRolePermission(rest);
    permission.role = new UserRoleEntity(role);

    return permission;
  }
}

export default UsersRolesPermissionsController;
