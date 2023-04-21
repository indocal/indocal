import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Log, ApiToken, User } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { JWT } from '../auth/types';

import { LogEntity } from './entities';
import { FindManyLogsParamsDto, CountLogsParamsDto } from './dto';

class EnhancedLog extends LogEntity {
  authentication: JWT | null;
}

type CreateEnhancedLog = Log & {
  apiToken: ApiToken | null;
  user: User | null;
};

@Controller('logs')
@UseGuards(PoliciesGuard)
export class LoggingController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedLog({
    user,
    apiToken,
    ...rest
  }: CreateEnhancedLog): EnhancedLog {
    const log = new EnhancedLog(rest);

    log.authentication = apiToken
      ? {
          type: 'api-token',
          apiToken: {
            id: apiToken.id,
            name: apiToken.name,
            description: apiToken.description,
          },
        }
      : user
      ? {
          type: 'user',
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
          },
        }
      : null;

    return log;
  }

  @Get('count')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: false },
    user: (ability) => ability.can('count', 'log'),
  })
  async count(@Query() query: CountLogsParamsDto): Promise<number> {
    return await this.prismaService.log.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: false },
    user: (ability) => ability.can('read', 'log'),
  })
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
        include: { apiToken: true, user: true },
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
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: false },
    user: (ability) => ability.can('read', 'log'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedLog | null>> {
    const log = await this.prismaService.log.findUnique({
      where: { id },
      include: { apiToken: true, user: true },
    });

    return log ? this.createEnhancedLog(log) : null;
  }
}

export default LoggingController;
