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
import { PrismaService } from 'nestjs-prisma';
import { UserRolePermission, UserRole } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';

import { PoliciesGuard } from '../../strategies/attribute-based-access-control';
import { CheckPolicies } from '../../decorators/check-policies.decorator';

import { UserRoleEntity } from '../roles/entities';

import { UserRolePermissionEntity } from './entities';
import {
  CreateUserRolePermissionDto,
  UpdateUserRolePermissionDto,
} from './dto';

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

  @Post('auth/roles/:role_id/permissions')
  @CheckPolicies((ability) => ability.can('create', 'userRolePermission'))
  async create(
    @Param('role_id') roleId: UUID,
    @Body() createPermissionDto: CreateUserRolePermissionDto
  ): Promise<SingleEntityResponse<EnhancedUserRolePermission>> {
    const permission = await this.prismaService.userRolePermission.create({
      data: {
        action: createPermissionDto.action,
        role: { connect: { id: roleId } },
      },
      include: { role: true },
    });

    return this.createEnhancedUserRolePermission(permission);
  }

  @Get('auth/roles/:role_id/permissions/count')
  @CheckPolicies((ability) => ability.can('count', 'userRolePermission'))
  async count(@Param('role_id') roleId: UUID): Promise<number> {
    return await this.prismaService.userRolePermission.count({
      where: { role: { id: roleId } },
    });
  }

  @Get('auth/roles/:role_id/permissions')
  @CheckPolicies((ability) => ability.can('read', 'userRolePermission'))
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
  @CheckPolicies((ability) => ability.can('read', 'userRolePermission'))
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

  @Patch('auth/roles/permissions/:id')
  @CheckPolicies((ability) => ability.can('update', 'userRolePermission'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updatePermissionDto: UpdateUserRolePermissionDto
  ): Promise<SingleEntityResponse<EnhancedUserRolePermission>> {
    const permission = await this.prismaService.userRolePermission.update({
      where: { id },
      data: { action: updatePermissionDto.action },
      include: { role: true },
    });

    return this.createEnhancedUserRolePermission(permission);
  }

  @Delete('auth/roles/permissions/:id')
  @CheckPolicies((ability) => ability.can('delete', 'userRolePermission'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedUserRolePermission>> {
    const permission = await this.prismaService.userRolePermission.delete({
      where: { id },
      include: { role: true },
    });

    return this.createEnhancedUserRolePermission(permission);
  }
}

export default UsersRolesPermissionsController;
