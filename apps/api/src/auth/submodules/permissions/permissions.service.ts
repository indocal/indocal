import { Injectable } from '@nestjs/common';
import {
  Prisma,
  UserRole as DBUserRoleModel,
  UserRolePermission as DBUserRolePermissionModel,
} from '@prisma/client';

import { PrismaService, UUID } from '@/common';

import {
  CreateUserRolePermissionDto,
  UpdateUserRolePermissionDto,
} from './dto';

@Injectable()
export class UsersRolesPermissionsService {
  constructor(private prismaService: PrismaService) {}

  async create(
    role: UUID | DBUserRoleModel,
    createUserRolePermissionDto: CreateUserRolePermissionDto
  ): Promise<DBUserRolePermissionModel> {
    return await this.prismaService.userRolePermission.create({
      data: {
        action: createUserRolePermissionDto.action,
        role: { connect: { id: typeof role === 'string' ? role : role.id } },
      },
    });
  }

  async count(role: UUID | DBUserRoleModel): Promise<number> {
    return await this.prismaService.userRolePermission.count({
      where: { role: { id: typeof role === 'string' ? role : role.id } },
    });
  }

  async findAll(
    role: UUID | DBUserRoleModel
  ): Promise<DBUserRolePermissionModel[]> {
    return await this.prismaService.userRolePermission.findMany({
      where: { role: { id: typeof role === 'string' ? role : role.id } },
    });
  }

  async findUnique(
    input: Prisma.UserRolePermissionWhereUniqueInput
  ): Promise<DBUserRolePermissionModel | null> {
    return await this.prismaService.userRolePermission.findUnique({
      where: input,
    });
  }

  async update(
    id: UUID,
    updateUserRolePermissionDto: UpdateUserRolePermissionDto
  ): Promise<DBUserRolePermissionModel> {
    return await this.prismaService.userRolePermission.update({
      where: { id },
      data: { action: updateUserRolePermissionDto.action },
    });
  }

  async delete(id: UUID): Promise<DBUserRolePermissionModel> {
    return await this.prismaService.userRolePermission.delete({
      where: { id },
    });
  }
}

export default UsersRolesPermissionsService;
