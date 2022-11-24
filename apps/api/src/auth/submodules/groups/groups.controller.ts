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

import UsersService from '../users/users.service';

import UsersGroupsService from './groups.service';
import { UserGroupEntity } from './entities';
import {
  FindManyUsersGroupsParamsDto,
  CountUsersGroupsParamsDto,
  CreateUserGroupDto,
  UpdateUserGroupDto,
} from './dto';

@Controller('auth/groups')
@UseGuards(PoliciesGuard)
export class UsersGroupsController {
  constructor(
    private usersGroupsService: UsersGroupsService,
    private usersService: UsersService
  ) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'userGroup'))
  async create(
    @Body() createUserGroupDto: CreateUserGroupDto
  ): Promise<UserGroupEntity> {
    const group = await this.usersGroupsService.create(createUserGroupDto);

    const members = await this.usersService.findMany({
      where: { groups: { some: { id: group.id } } },
    });

    return new UserGroupEntity(group, { members });
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'userGroup'))
  async count(@Query() query: CountUsersGroupsParamsDto): Promise<number> {
    return await this.usersGroupsService.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'userGroup'))
  async findMany(
    @Query() query: FindManyUsersGroupsParamsDto
  ): Promise<UserGroupEntity[]> {
    const groups = await this.usersGroupsService.findMany({
      where: query.filters,
      distinct: query.distinct,
      orderBy: query.orderBy,
      skip: query.pagination?.skip && Number(query.pagination.skip),
      take: query.pagination?.take && Number(query.pagination.take),
      cursor: query.pagination?.cursor,
    });

    return await Promise.all(
      groups.map(async (group) => {
        const members = await this.usersService.findMany({
          where: { groups: { some: { id: group.id } } },
        });

        return new UserGroupEntity(group, { members });
      })
    );
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'userGroup'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<UserGroupEntity | null> {
    const group = await this.usersGroupsService.findUnique({ id });

    const members = await this.usersService.findMany({
      where: { groups: { some: { id } } },
    });

    return group ? new UserGroupEntity(group, { members }) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'userGroup'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateUserGroupDto: UpdateUserGroupDto
  ): Promise<UserGroupEntity> {
    const group = await this.usersGroupsService.update(id, updateUserGroupDto);

    const members = await this.usersService.findMany({
      where: { groups: { some: { id: group.id } } },
    });

    return new UserGroupEntity(group, { members });
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'userGroup'))
  async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<UserGroupEntity> {
    const group = await this.usersGroupsService.delete(id);

    const members = await this.usersService.findMany({
      where: { groups: { some: { id: group.id } } },
    });

    return new UserGroupEntity(group, { members });
  }
}

export default UsersGroupsController;
