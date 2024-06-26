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
import { PrismaService } from 'nestjs-prisma';
import { User, UserRole, UserGroup } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';

import { PoliciesGuard } from '../../strategies/attribute-based-access-control';
import { CheckPolicies } from '../../decorators/check-policies.decorator';

import { UserRoleEntity } from '../roles/entities';
import { UserGroupEntity } from '../groups/entities';

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

type CreateEnhancedUser = User & {
  roles: UserRole[];
  groups: UserGroup[];
};

@Controller('auth/users')
@UseGuards(PoliciesGuard)
export class UsersController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedUser({
    roles,
    groups,
    ...rest
  }: CreateEnhancedUser): EnhancedUser {
    const user = new EnhancedUser(rest);
    user.roles = roles.map((role) => new UserRoleEntity(role));
    user.groups = groups.map((group) => new UserGroupEntity(group));

    return user;
  }

  @Post()
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('create', 'user'),
  })
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<SingleEntityResponse<EnhancedUser>> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);

    const user = await this.prismaService.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        name: createUserDto.name,
        password: hash,
      },
      include: { roles: true, groups: true },
    });

    return this.createEnhancedUser(user);
  }

  @Get('count')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('count', 'user'),
  })
  async count(@Query() query: CountUsersParamsDto): Promise<number> {
    return await this.prismaService.user.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'user'),
  })
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
      entities: users.map((user) => this.createEnhancedUser(user)),
    };
  }

  @Get(':id')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'user'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedUser | null>> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { roles: true, groups: true },
    });

    return user ? this.createEnhancedUser(user) : null;
  }

  @Patch(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('update', 'user'),
  })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<SingleEntityResponse<EnhancedUser>> {
    const user = await this.prismaService.user.update({
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

    return this.createEnhancedUser(user);
  }

  @Delete(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('delete', 'user'),
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedUser>> {
    const user = await this.prismaService.user.delete({
      where: { id },
      include: { roles: true, groups: true },
    });

    return this.createEnhancedUser(user);
  }
}

export default UsersController;
