import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import { UUID } from '@/common';
import { PoliciesGuard, CheckPolicies, Action, UserEntity } from '@/auth';
import { PrismaService } from '@/prisma';

import { LogEntity } from './entities';
import { FindManyLogsParamsDto, CountLogsParamsDto } from './dto';

class EnhancedLog extends LogEntity {
  user: UserEntity | null;
}

@Controller('logs')
@UseGuards(PoliciesGuard)
export class LoggingController {
  constructor(private prismaService: PrismaService) {}

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
  ): Promise<EnhancedLog[]> {
    const logs = await this.prismaService.log.findMany({
      where: query.filters,
      distinct: query.distinct,
      orderBy: query.orderBy,
      skip: query.pagination?.skip && Number(query.pagination.skip),
      take: query.pagination?.take && Number(query.pagination.take),
      cursor: query.pagination?.cursor,
      include: { user: true },
    });

    return logs.map(({ user, ...rest }) => {
      const log = new EnhancedLog(rest);
      log.user = user ? new UserEntity(user) : null;

      return log;
    });
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'log'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<EnhancedLog | null> {
    const response = await this.prismaService.log.findUnique({
      where: { id },
      include: { user: true },
    });

    if (response) {
      const { user, ...rest } = response;

      const log = new EnhancedLog(rest);
      log.user = user ? new UserEntity(user) : null;

      return log;
    }

    return null;
  }
}

export default LoggingController;
