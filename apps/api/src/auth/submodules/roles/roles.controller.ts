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
import { UserRolePermissionEntity, UserEntity } from '@/auth';
import { PrismaService } from '@/prisma';

import {
  PoliciesGuard,
  Action,
} from '../../strategies/attribute-based-access-control';
import { CheckPolicies } from '../../decorators/check-policies.decorator';

import { UserRoleEntity } from './entities';
import {
  FindManyUsersRolesParamsDto,
  CountUsersRolesParamsDto,
  CreateUserRoleDto,
  UpdateUserRoleDto,
} from './dto';

class EnhancedUserRole extends UserRoleEntity {
  permissions: UserRolePermissionEntity[];
  users: UserEntity[];
}

@Controller('auth/roles')
@UseGuards(PoliciesGuard)
export class UsersRolesController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'userRole'))
  async create(
    @Body() createRoleDto: CreateUserRoleDto
  ): Promise<EnhancedUserRole> {
    const { permissions, users, ...rest } =
      await this.prismaService.userRole.create({
        data: {
          type: createRoleDto.type,
          name: createRoleDto.name,
          description: createRoleDto.description,
        },
        include: { permissions: true, users: true },
      });

    const role = new EnhancedUserRole(rest);

    role.permissions = permissions.map(
      (permission) => new UserRolePermissionEntity(permission)
    );

    role.users = users.map((user) => new UserEntity(user));

    return role;
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'userRole'))
  async count(@Query() query: CountUsersRolesParamsDto): Promise<number> {
    return await this.prismaService.userRole.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'userRole'))
  async findMany(
    @Query() query: FindManyUsersRolesParamsDto
  ): Promise<EnhancedUserRole[]> {
    const roles = await this.prismaService.userRole.findMany({
      where: query.filters,
      distinct: query.distinct,
      orderBy: query.orderBy,
      skip: query.pagination?.skip && Number(query.pagination.skip),
      take: query.pagination?.take && Number(query.pagination.take),
      cursor: query.pagination?.cursor,
      include: { permissions: true, users: true },
    });

    return roles.map(({ permissions, users, ...rest }) => {
      const role = new EnhancedUserRole(rest);

      role.permissions = permissions.map(
        (permission) => new UserRolePermissionEntity(permission)
      );

      role.users = users.map((user) => new UserEntity(user));

      return role;
    });
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'userRole'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<EnhancedUserRole | null> {
    const response = await this.prismaService.userRole.findUnique({
      where: { id },
      include: { permissions: true, users: true },
    });

    if (response) {
      const { permissions, users, ...rest } = response;

      const role = new EnhancedUserRole(rest);

      role.permissions = permissions.map(
        (permission) => new UserRolePermissionEntity(permission)
      );

      role.users = users.map((user) => new UserEntity(user));

      return role;
    }

    return null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'userRole'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateRoleDto: UpdateUserRoleDto
  ): Promise<EnhancedUserRole> {
    const { permissions, users, ...rest } =
      await this.prismaService.userRole.update({
        where: { id },
        data: {
          type: updateRoleDto.type,
          name: updateRoleDto.name,
          description: updateRoleDto.description,
          config: updateRoleDto.config,

          ...(updateRoleDto.permissions && {
            permissions: {
              createMany: {
                skipDuplicates: true,
                data: Object.entries(updateRoleDto.permissions)
                  .map(([scope, permissions]) => {
                    const actions = Object.entries(permissions).filter(
                      ([, value]) => value === true
                    );

                    return actions.map(([action]) => ({
                      action: `${scope}::${action}`,
                    }));
                  })
                  .flat(),
              },

              deleteMany: Object.entries(updateRoleDto.permissions)
                .map(([scope, permissions]) => {
                  const actions = Object.entries(permissions).filter(
                    ([, value]) => value === false
                  );

                  return actions.map(([action]) => ({
                    action: `${scope}::${action}`,
                  }));
                })
                .flat(),
            },
          }),

          ...(updateRoleDto.users && {
            users: {
              set: updateRoleDto.users.map((user) => ({ id: user })),
            },
          }),
        },
        include: { permissions: true, users: true },
      });

    const role = new EnhancedUserRole(rest);

    role.permissions = permissions.map(
      (permission) => new UserRolePermissionEntity(permission)
    );

    role.users = users.map((user) => new UserEntity(user));

    return role;
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'userRole'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<EnhancedUserRole> {
    const { permissions, users, ...rest } =
      await this.prismaService.userRole.delete({
        where: { id },
        include: { permissions: true, users: true },
      });

    const role = new EnhancedUserRole(rest);

    role.permissions = permissions.map(
      (permission) => new UserRolePermissionEntity(permission)
    );

    role.users = users.map((user) => new UserEntity(user));

    return role;
  }
}

export default UsersRolesController;
