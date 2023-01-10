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
import * as bcrypt from 'bcrypt';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { UserRoleEntity, UserGroupEntity } from '@/auth';
import { PrismaService } from '@/prisma';

import {
  PoliciesGuard,
  Action,
} from '../../strategies/attribute-based-access-control';
import { CheckPolicies } from '../../decorators/check-policies.decorator';

import { UserEntity } from './entities';
import {
  FindManyUsersParamsDto,
  CountUsersParamsDto,
  CreateUserDto,
  UpdateUserDto,
} from './dto';

class EnhancedUser extends UserEntity {
  roles: UserRoleEntity[];
  groups: UserGroupEntity[];
}

@Controller('auth/users')
@UseGuards(PoliciesGuard)
export class UsersController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'user'))
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<SingleEntityResponse<EnhancedUser>> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);

    const { roles, groups, ...rest } = await this.prismaService.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        name: createUserDto.name,
        password: hash,
      },
      include: { roles: true, groups: true },
    });

    const user = new EnhancedUser(rest);
    user.roles = roles.map((role) => new UserRoleEntity(role));
    user.groups = groups.map((group) => new UserGroupEntity(group));

    return user;
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'user'))
  async count(@Query() query: CountUsersParamsDto): Promise<number> {
    return await this.prismaService.user.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'user'))
  async findMany(
    @Query() query: FindManyUsersParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedUser>> {
    const [users, count] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: { roles: true, groups: true },
      }),
      this.prismaService.user.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: users.map(({ roles, groups, ...rest }) => {
        const user = new EnhancedUser(rest);
        user.roles = roles.map((role) => new UserRoleEntity(role));
        user.groups = groups.map((group) => new UserGroupEntity(group));

        return user;
      }),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'user'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedUser | null>> {
    const response = await this.prismaService.user.findUnique({
      where: { id },
      include: { roles: true, groups: true },
    });

    if (response) {
      const { roles, groups, ...rest } = response;

      const user = new EnhancedUser(rest);
      user.roles = roles.map((role) => new UserRoleEntity(role));
      user.groups = groups.map((group) => new UserGroupEntity(group));

      return user;
    }

    return null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'user'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<SingleEntityResponse<EnhancedUser>> {
    const { roles, groups, ...rest } = await this.prismaService.user.update({
      where: { id },
      data: {
        username: updateUserDto.username,
        email: updateUserDto.email,
        name: updateUserDto.name,
        status: updateUserDto.status,

        ...(updateUserDto.roles && {
          roles: { set: updateUserDto.roles.map((role) => ({ id: role })) },
        }),

        ...(updateUserDto.groups && {
          groups: { set: updateUserDto.groups.map((group) => ({ id: group })) },
        }),
      },
      include: { roles: true, groups: true },
    });

    const user = new EnhancedUser(rest);
    user.roles = roles.map((role) => new UserRoleEntity(role));
    user.groups = groups.map((group) => new UserGroupEntity(group));

    return user;
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'user'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedUser>> {
    const { roles, groups, ...rest } = await this.prismaService.user.delete({
      where: { id },
      include: { roles: true, groups: true },
    });

    const user = new EnhancedUser(rest);
    user.roles = roles.map((role) => new UserRoleEntity(role));
    user.groups = groups.map((group) => new UserGroupEntity(group));

    return user;
  }
}

export default UsersController;
