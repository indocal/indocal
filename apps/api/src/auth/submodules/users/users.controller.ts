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

import UsersService from './users.service';
import { UserEntity } from './entities';
import {
  FindManyUsersParamsDto,
  CountUsersParamsDto,
  CreateUserDto,
  UpdateUserDto,
} from './dto';

import UsersRolesService from '../roles/roles.service';
import UsersGroupsService from '../groups/groups.service';

@Controller('auth/users')
@UseGuards(PoliciesGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersRolesService: UsersRolesService,
    private usersGroupsService: UsersGroupsService
  ) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'user'))
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.usersService.create(createUserDto);

    const roles = await this.usersRolesService.findMany({
      where: { users: { some: { id: user.id } } },
    });

    const groups = await this.usersGroupsService.findMany({
      where: { members: { some: { id: user.id } } },
    });

    return new UserEntity(user, roles, groups);
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'user'))
  async count(@Query() query: CountUsersParamsDto): Promise<number> {
    return await this.usersService.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'user'))
  async findMany(
    @Query() query: FindManyUsersParamsDto
  ): Promise<UserEntity[]> {
    const users = await this.usersService.findMany({
      where: query.filters,
      distinct: query.distinct,
      orderBy: query.orderBy,
      skip: query.pagination?.skip && Number(query.pagination.skip),
      take: query.pagination?.take && Number(query.pagination.take),
      cursor: query.pagination?.cursor,
    });

    return await Promise.all(
      users.map(async (user) => {
        const roles = await this.usersRolesService.findMany({
          where: { users: { some: { id: user.id } } },
        });

        const groups = await this.usersGroupsService.findMany({
          where: { members: { some: { id: user.id } } },
        });

        return new UserEntity(user, roles, groups);
      })
    );
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'user'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<UserEntity | null> {
    const user = await this.usersService.findUnique('id', id);

    const roles = await this.usersRolesService.findMany({
      where: { users: { some: { id } } },
    });

    const groups = await this.usersGroupsService.findMany({
      where: { members: { some: { id } } },
    });

    return user ? new UserEntity(user, roles, groups) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'user'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    const user = await this.usersService.update(id, updateUserDto);

    const roles = await this.usersRolesService.findMany({
      where: { users: { some: { id: user.id } } },
    });

    const groups = await this.usersGroupsService.findMany({
      where: { members: { some: { id: user.id } } },
    });

    return new UserEntity(user, roles, groups);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'user'))
  async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<UserEntity> {
    const user = await this.usersService.delete(id);

    const roles = await this.usersRolesService.findMany({
      where: { users: { some: { id: user.id } } },
    });

    const groups = await this.usersGroupsService.findMany({
      where: { members: { some: { id: user.id } } },
    });

    return new UserEntity(user, roles, groups);
  }
}

export default UsersController;
