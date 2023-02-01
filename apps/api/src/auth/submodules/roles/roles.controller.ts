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
import { UserRole, UserRolePermission, User } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PrismaService } from '@/prisma';

import { PoliciesGuard } from '../../strategies/attribute-based-access-control';
import { CheckPolicies } from '../../decorators/check-policies.decorator';

import { UserRolePermissionEntity } from '../permissions/entities';
import { UserEntity } from '../users/entities';

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

type CreateEnhancedUserRole = UserRole & {
  permissions: UserRolePermission[];
  users: User[];
};

@Controller('auth/roles')
@UseGuards(PoliciesGuard)
export class UsersRolesController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedUserRole({
    permissions,
    users,
    ...rest
  }: CreateEnhancedUserRole): EnhancedUserRole {
    const role = new EnhancedUserRole(rest);

    role.permissions = permissions.map(
      (permission) => new UserRolePermissionEntity(permission)
    );

    role.users = users.map((user) => new UserEntity(user));

    return role;
  }

  @Post()
  @CheckPolicies((ability) => ability.can('create', 'userRole'))
  async create(
    @Body() createRoleDto: CreateUserRoleDto
  ): Promise<SingleEntityResponse<EnhancedUserRole>> {
    const role = await this.prismaService.userRole.create({
      data: {
        type: createRoleDto.type,
        name: createRoleDto.name,
        description: createRoleDto.description,
      },
      include: { permissions: true, users: true },
    });

    return this.createEnhancedUserRole(role);
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can('count', 'userRole'))
  async count(@Query() query: CountUsersRolesParamsDto): Promise<number> {
    return await this.prismaService.userRole.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can('read', 'userRole'))
  async findMany(
    @Query() query: FindManyUsersRolesParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedUserRole>> {
    const [roles, count] = await this.prismaService.$transaction([
      this.prismaService.userRole.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: { permissions: true, users: true },
      }),
      this.prismaService.userRole.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: roles.map((role) => this.createEnhancedUserRole(role)),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can('read', 'userRole'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedUserRole | null>> {
    const role = await this.prismaService.userRole.findUnique({
      where: { id },
      include: { permissions: true, users: true },
    });

    return role ? this.createEnhancedUserRole(role) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can('update', 'userRole'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateRoleDto: UpdateUserRoleDto
  ): Promise<SingleEntityResponse<EnhancedUserRole>> {
    const role = await this.prismaService.userRole.update({
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

    return this.createEnhancedUserRole(role);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can('delete', 'userRole'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedUserRole>> {
    const role = await this.prismaService.userRole.delete({
      where: { id },
      include: { permissions: true, users: true },
    });

    return this.createEnhancedUserRole(role);
  }
}

export default UsersRolesController;
