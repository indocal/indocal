import { Injectable } from '@nestjs/common';
import { Prisma, Log as DBLogModel } from '@prisma/client';

import { PrismaService } from '@/common';
import { AuthenticatedUser } from '@/auth';

import { LogMetadata } from './entities';

export type CreateLogArgs = {
  context: string;
  action: string; // method::handler
  user: AuthenticatedUser | null;
  metadata: LogMetadata;
};

@Injectable()
export class LoggingService {
  constructor(private prismaService: PrismaService) {}

  async count(params: Prisma.LogCountArgs): Promise<number> {
    return await this.prismaService.log.count(params);
  }

  async findMany(params: Prisma.LogFindManyArgs): Promise<DBLogModel[]> {
    return await this.prismaService.log.findMany(params);
  }

  async findUnique(
    input: Prisma.LogWhereUniqueInput
  ): Promise<DBLogModel | null> {
    return await this.prismaService.log.findUnique({ where: input });
  }

  async create({
    context,
    action,
    user,
    metadata,
  }: CreateLogArgs): Promise<void> {
    await this.prismaService.log.create({
      data: {
        context,
        action,
        metadata,
        ...(user && { user: { connect: { id: user.id } } }),
      },
    });
  }
}

export default LoggingService;
