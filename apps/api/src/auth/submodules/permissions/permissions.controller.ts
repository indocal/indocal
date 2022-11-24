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

import { UUID } from '@/common';

import {
  PoliciesGuard,
  Action,
} from '../../strategies/attribute-based-access-control';
import { CheckPolicies } from '../../decorators/check-policies.decorator';

import UsersRolesPermissionsService from './permissions.service';
import { UserRolePermissionEntity } from './entities';
import {
  CreateUserRolePermissionDto,
  UpdateUserRolePermissionDto,
} from './dto';

@Controller()
@UseGuards(PoliciesGuard)
export class UsersRolesPermissionsController {
  constructor(
    private usersRolesPermissionsService: UsersRolesPermissionsService
  ) {}

  @Post('auth/roles/:role_id/permissions')
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'userRolePermission'))
  async create(
    @Param('role_id') roleId: UUID,
    @Body() createUserRolePermissionDto: CreateUserRolePermissionDto
  ): Promise<UserRolePermissionEntity> {
    const permission = await this.usersRolesPermissionsService.create(
      roleId,
      createUserRolePermissionDto
    );

    return new UserRolePermissionEntity(permission);
  }

  @Get('auth/roles/:role_id/permissions/count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'userRolePermission'))
  async count(@Param('role_id') roleId: UUID): Promise<number> {
    return await this.usersRolesPermissionsService.count(roleId);
  }

  @Get('auth/roles/:role_id/permissions')
  @CheckPolicies((ability) => ability.can(Action.READ, 'userRolePermission'))
  async findAll(
    @Param('role_id') roleId: UUID
  ): Promise<UserRolePermissionEntity[]> {
    const permissions = await this.usersRolesPermissionsService.findAll(roleId);

    return permissions.map(
      (permission) => new UserRolePermissionEntity(permission)
    );
  }

  @Get('auth/roles/permissions/:id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'userRolePermission'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<UserRolePermissionEntity | null> {
    const permission = await this.usersRolesPermissionsService.findUnique({
      id,
    });

    return permission ? new UserRolePermissionEntity(permission) : null;
  }

  @Patch('auth/roles/permissions/:id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'userRolePermission'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateUserRolePermissionDto: UpdateUserRolePermissionDto
  ): Promise<UserRolePermissionEntity> {
    const permission = await this.usersRolesPermissionsService.update(
      id,
      updateUserRolePermissionDto
    );

    return new UserRolePermissionEntity(permission);
  }

  @Delete('auth/roles/permissions/:id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'userRolePermission'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<UserRolePermissionEntity> {
    const permission = await this.usersRolesPermissionsService.delete(id);

    return new UserRolePermissionEntity(permission);
  }
}

export default UsersRolesPermissionsController;
