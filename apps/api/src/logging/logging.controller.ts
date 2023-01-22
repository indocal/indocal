import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { Log, User } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';
import { PrismaService } from '@/prisma';

import { UserEntity } from '../auth/submodules/users/entities';

import { LogEntity } from './entities';
import { FindManyLogsParamsDto, CountLogsParamsDto } from './dto';

class EnhancedLog extends LogEntity {
  user: UserEntity | null;
}

type CreateEnhancedLog = Log & {
  user: User | null;
};

@Controller('logs')
@UseGuards(PoliciesGuard)
export class LoggingController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedLog({ user, ...rest }: CreateEnhancedLog): EnhancedLog {
    const log = new EnhancedLog(rest);
    log.user = user ? new UserEntity(user) : null;

    return log;
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'log'))
  async count(@Query() query: CountLogsParamsDto): Promise<number> {
    return await this.prismaService.log.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'log'))
  async findMany(
    @Query() query: FindManyLogsParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedLog>> {
    const [logs, count] = await this.prismaService.$transaction([
      this.prismaService.log.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: { user: true },
      }),
      this.prismaService.log.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: logs.map((log) => this.createEnhancedLog(log)),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'log'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedLog | null>> {
    const log = await this.prismaService.log.findUnique({
      where: { id },
      include: { user: true },
    });

    return log ? this.createEnhancedLog(log) : null;
  }
}

export default LoggingController;
