import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
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

import UsersRolesService from './roles.service';
import { UserRoleEntity } from './entities';
import {
  FindManyUsersRolesParamsDto,
  CountUsersRolesParamsDto,
  CreateUserRoleDto,
  UpdateUserRoleDto,
} from './dto';

import UsersRolesPermissionsService from '../permissions/permissions.service';
import UsersService from '../users/users.service';

@Controller('auth/roles')
@UseGuards(PoliciesGuard)
export class UsersRolesController {
  constructor(
    private usersRolesService: UsersRolesService,
    private usersRolesPermissionsService: UsersRolesPermissionsService,
    private usersService: UsersService
  ) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'userRole'))
  async create(
    @Body() createUserRoleDto: CreateUserRoleDto
  ): Promise<UserRoleEntity> {
    const role = await this.usersRolesService.create(createUserRoleDto);
    const permissions = await this.usersRolesPermissionsService.findAll(role);

    const users = await this.usersService.findMany({
      where: { roles: { some: { id: role.id } } },
    });

    return new UserRoleEntity(role, permissions, users);
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'userRole'))
  async count(@Query() query: CountUsersRolesParamsDto): Promise<number> {
    return await this.usersRolesService.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'userRole'))
  async findMany(
    @Query() query: FindManyUsersRolesParamsDto
  ): Promise<UserRoleEntity[]> {
    const roles = await this.usersRolesService.findMany({
      where: query.filters,
      distinct: query.distinct,
      orderBy: query.orderBy,
      skip: query.pagination?.skip && Number(query.pagination.skip),
      take: query.pagination?.take && Number(query.pagination.take),
      cursor: query.pagination?.cursor,
    });

    return await Promise.all(
      roles.map(async (role) => {
        const permissions = await this.usersRolesPermissionsService.findAll(
          role
        );

        const users = await this.usersService.findMany({
          where: { roles: { some: { id: role.id } } },
        });

        return new UserRoleEntity(role, permissions, users);
      })
    );
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'userRole'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<UserRoleEntity | null> {
    const role = await this.usersRolesService.findUnique('id', id);
    const permissions = await this.usersRolesPermissionsService.findAll(id);

    const users = await this.usersService.findMany({
      where: { roles: { some: { id } } },
    });

    return role ? new UserRoleEntity(role, permissions, users) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'userRole'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ): Promise<UserRoleEntity> {
    const role = await this.usersRolesService.update(id, updateUserRoleDto);
    const permissions = await this.usersRolesPermissionsService.findAll(role);

    const users = await this.usersService.findMany({
      where: { roles: { some: { id: role.id } } },
    });

    return new UserRoleEntity(role, permissions, users);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'userRole'))
  async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<UserRoleEntity> {
    const role = await this.usersRolesService.delete(id);
    const permissions = await this.usersRolesPermissionsService.findAll(role);

    const users = await this.usersService.findMany({
      where: { roles: { some: { id: role.id } } },
    });

    return new UserRoleEntity(role, permissions, users);
  }
}

export default UsersRolesController;
