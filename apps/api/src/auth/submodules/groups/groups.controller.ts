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

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { UserEntity } from '@/auth';
import { PrismaService } from '@/prisma';

import {
  PoliciesGuard,
  Action,
} from '../../strategies/attribute-based-access-control';
import { CheckPolicies } from '../../decorators/check-policies.decorator';

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

@Controller('auth/groups')
@UseGuards(PoliciesGuard)
export class UsersGroupsController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'userGroup'))
  async create(
    @Body() createGroupDto: CreateUserGroupDto
  ): Promise<SingleEntityResponse<EnhancedUserGroup>> {
    const { members, ...rest } = await this.prismaService.userGroup.create({
      data: {
        name: createGroupDto.name,
        description: createGroupDto.description,
      },
      include: { members: true },
    });

    const group = new EnhancedUserGroup(rest);
    group.members = members.map((member) => new UserEntity(member));

    return group;
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'userGroup'))
  async count(@Query() query: CountUsersGroupsParamsDto): Promise<number> {
    return await this.prismaService.userGroup.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'userGroup'))
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
      entities: groups.map(({ members, ...rest }) => {
        const group = new EnhancedUserGroup(rest);
        group.members = members.map((member) => new UserEntity(member));

        return group;
      }),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'userGroup'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedUserGroup | null>> {
    const response = await this.prismaService.userGroup.findUnique({
      where: { id },
      include: { members: true },
    });

    if (response) {
      const { members, ...rest } = response;

      const group = new EnhancedUserGroup(rest);
      group.members = members.map((member) => new UserEntity(member));

      return group;
    }

    return null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'userGroup'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateGroupDto: UpdateUserGroupDto
  ): Promise<SingleEntityResponse<EnhancedUserGroup>> {
    const { members, ...rest } = await this.prismaService.userGroup.update({
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

    const group = new EnhancedUserGroup(rest);
    group.members = members.map((member) => new UserEntity(member));

    return group;
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'userGroup'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedUserGroup>> {
    const { members, ...rest } = await this.prismaService.userGroup.delete({
      where: { id },
      include: { members: true },
    });

    const group = new EnhancedUserGroup(rest);
    group.members = members.map((member) => new UserEntity(member));

    return group;
  }
}

export default UsersGroupsController;
