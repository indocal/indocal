import { Injectable } from '@nestjs/common';
import { Prisma, UserGroup as DBUserGroupModel } from '@prisma/client';

import { PrismaService, UUID } from '@/common';

import { CreateUserGroupDto, UpdateUserGroupDto } from './dto';

@Injectable()
export class UsersGroupsService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createUserGroupDto: CreateUserGroupDto
  ): Promise<DBUserGroupModel> {
    return await this.prismaService.userGroup.create({
      data: {
        name: createUserGroupDto.name,
        description: createUserGroupDto.description,
      },
    });
  }

  async count(params: Prisma.UserGroupCountArgs): Promise<number> {
    return await this.prismaService.userGroup.count(params);
  }

  async findMany(
    params: Prisma.UserGroupFindManyArgs
  ): Promise<DBUserGroupModel[]> {
    return await this.prismaService.userGroup.findMany(params);
  }

  async findUnique(
    input: Prisma.UserGroupWhereUniqueInput
  ): Promise<DBUserGroupModel | null> {
    return await this.prismaService.userGroup.findUnique({ where: input });
  }

  async update(
    id: UUID,
    updateUserGroupDto: UpdateUserGroupDto
  ): Promise<DBUserGroupModel> {
    return await this.prismaService.userGroup.update({
      where: { id },
      data: {
        name: updateUserGroupDto.name,
        description: updateUserGroupDto.description,

        ...(updateUserGroupDto.members && {
          members: {
            set: updateUserGroupDto.members.map((member) => ({ id: member })),
          },
        }),
      },
    });
  }

  async delete(id: UUID): Promise<DBUserGroupModel> {
    return await this.prismaService.userGroup.delete({ where: { id } });
  }
}

export default UsersGroupsService;
