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
import { UserGroup, User } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';

import { PoliciesGuard } from '../../strategies/attribute-based-access-control';
import { CheckPolicies } from '../../decorators/check-policies.decorator';

import { UserEntity } from '../users/entities';

import { UserGroupEntity } from './entities';
import {
  FindManyUsersGroupsParamsDto,
  CountUsersGroupsParamsDto,
  CreateUserGroupDto,
  UpdateUserGroupDto,
} from './dto';

class EnhancedUserGroup extends UserGroupEntity {
  members: UserEntity[];
}

type CreateEnhancedUserGroup = UserGroup & {
  members: User[];
};

@Controller('auth/groups')
@UseGuards(PoliciesGuard)
export class UsersGroupsController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedUserGroup({
    members,
    ...rest
  }: CreateEnhancedUserGroup): EnhancedUserGroup {
    const group = new EnhancedUserGroup(rest);
    group.members = members.map((member) => new UserEntity(member));

    return group;
  }

  @Post()
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('create', 'userGroup'),
  })
  async create(
    @Body() createGroupDto: CreateUserGroupDto
  ): Promise<SingleEntityResponse<EnhancedUserGroup>> {
    const group = await this.prismaService.userGroup.create({
      data: {
        name: createGroupDto.name,
        description: createGroupDto.description,
      },
      include: { members: true },
    });

    return this.createEnhancedUserGroup(group);
  }

  @Get('count')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('count', 'userGroup'),
  })
  async count(@Query() query: CountUsersGroupsParamsDto): Promise<number> {
    return await this.prismaService.userGroup.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'userGroup'),
  })
  async findMany(
    @Query() query: FindManyUsersGroupsParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedUserGroup>> {
    const [groups, count] = await this.prismaService.$transaction([
      this.prismaService.userGroup.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: { members: true },
      }),
      this.prismaService.userGroup.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: groups.map((group) => this.createEnhancedUserGroup(group)),
    };
  }

  @Get(':id')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'userGroup'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedUserGroup | null>> {
    const group = await this.prismaService.userGroup.findUnique({
      where: { id },
      include: { members: true },
    });

    return group ? this.createEnhancedUserGroup(group) : null;
  }

  @Patch(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('update', 'userGroup'),
  })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateGroupDto: UpdateUserGroupDto
  ): Promise<SingleEntityResponse<EnhancedUserGroup>> {
    const group = await this.prismaService.userGroup.update({
      where: { id },
      data: {
        name: updateGroupDto.name,
        description: updateGroupDto.description,

        ...(updateGroupDto.members && {
          members: {
            set: updateGroupDto.members.map((member) => ({ id: member })),
          },
        }),
      },
      include: { members: true },
    });

    return this.createEnhancedUserGroup(group);
  }

  @Delete(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('delete', 'userGroup'),
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedUserGroup>> {
    const group = await this.prismaService.userGroup.delete({
      where: { id },
      include: { members: true },
    });

    return this.createEnhancedUserGroup(group);
  }
}

export default UsersGroupsController;
