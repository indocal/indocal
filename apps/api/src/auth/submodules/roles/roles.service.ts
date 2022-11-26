import { Injectable } from '@nestjs/common';
import { Prisma, UserRole as DBUserRoleModel } from '@prisma/client';

import { PrismaService, UUID } from '@/common';

import { CreateUserRoleDto, UpdateUserRoleDto } from './dto';

@Injectable()
export class UsersRolesService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserRoleDto: CreateUserRoleDto): Promise<DBUserRoleModel> {
    return await this.prismaService.userRole.create({
      data: {
        type: createUserRoleDto.type,
        name: createUserRoleDto.name,
        description: createUserRoleDto.description,
      },
    });
  }

  async count(params: Prisma.UserRoleCountArgs): Promise<number> {
    return await this.prismaService.userRole.count(params);
  }

  async findMany(
    params: Prisma.UserRoleFindManyArgs
  ): Promise<DBUserRoleModel[]> {
    return await this.prismaService.userRole.findMany(params);
  }

  async findUnique(
    input: Prisma.UserRoleWhereUniqueInput
  ): Promise<DBUserRoleModel | null> {
    return await this.prismaService.userRole.findUnique({ where: input });
  }

  async update(
    id: UUID,
    updateUserRoleDto: UpdateUserRoleDto
  ): Promise<DBUserRoleModel> {
    return await this.prismaService.userRole.update({
      where: { id },
      data: {
        type: updateUserRoleDto.type,
        name: updateUserRoleDto.name,
        description: updateUserRoleDto.description,
        config: updateUserRoleDto.config,

        ...(updateUserRoleDto.permissions && {
          permissions: {
            createMany: {
              skipDuplicates: true,
              data: Object.entries(updateUserRoleDto.permissions)
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

            deleteMany: Object.entries(updateUserRoleDto.permissions)
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

        ...(updateUserRoleDto.users && {
          users: {
            set: updateUserRoleDto.users.map((user) => ({ id: user })),
          },
        }),
      },
    });
  }

  async delete(id: UUID): Promise<DBUserRoleModel> {
    return await this.prismaService.userRole.delete({ where: { id } });
  }
}

export default UsersRolesService;
