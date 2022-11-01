import { Injectable } from '@nestjs/common';
import { Prisma, User as DBUserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService, UUID } from '@/common';

import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<DBUserModel> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);

    return await this.prismaService.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: hash,
      },
    });
  }

  async count(params: Prisma.UserCountArgs): Promise<number> {
    return await this.prismaService.user.count(params);
  }

  async findMany(params: Prisma.UserFindManyArgs): Promise<DBUserModel[]> {
    return await this.prismaService.user.findMany(params);
  }

  async findUnique(
    identifier: keyof Prisma.UserWhereUniqueInput,
    input: string
  ): Promise<DBUserModel | null> {
    return await this.prismaService.user.findUnique({
      where: { [identifier]: input },
    });
  }

  async update(id: UUID, updateUserDto: UpdateUserDto): Promise<DBUserModel> {
    return await this.prismaService.user.update({
      where: { id },
      data: {
        username: updateUserDto.username,
        email: updateUserDto.email,
        status: updateUserDto.status,

        ...(updateUserDto.roles && {
          roles: { set: updateUserDto.roles.map((role) => ({ id: role })) },
        }),

        ...(updateUserDto.groups && {
          groups: { set: updateUserDto.groups.map((group) => ({ id: group })) },
        }),
      },
    });
  }

  async delete(id: UUID): Promise<DBUserModel> {
    return await this.prismaService.user.delete({ where: { id } });
  }
}

export default UsersService;
