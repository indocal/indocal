import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import { UUID } from '@/common';
import { PoliciesGuard, CheckPolicies, Action, UsersService } from '@/auth';

import LoggingService from './logging.service';
import { LogEntity } from './entities';
import { FindManyLogsParamsDto, CountLogsParamsDto } from './dto';

@Controller('logs')
@UseGuards(PoliciesGuard)
export class LoggingController {
  constructor(
    private loggingService: LoggingService,
    private usersService: UsersService
  ) {}

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'log'))
  async count(@Query() query: CountLogsParamsDto): Promise<number> {
    return await this.loggingService.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'log'))
  async findMany(@Query() query: FindManyLogsParamsDto): Promise<LogEntity[]> {
    const logs = await this.loggingService.findMany({
      where: query.filters,
      distinct: query.distinct,
      orderBy: query.orderBy,
      skip: query.pagination?.skip && Number(query.pagination.skip),
      take: query.pagination?.take && Number(query.pagination.take),
      cursor: query.pagination?.cursor,
    });

    return await Promise.all(
      logs.map(async (log) => {
        if (log.userId) {
          const user = await this.usersService.findUnique({ id: log.userId });

          return new LogEntity(log, { ...(user && { user }) });
        }

        return new LogEntity(log);
      })
    );
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'log'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<LogEntity | null> {
    const log = await this.loggingService.findUnique({ id });

    if (!log) return null;

    if (log.userId) {
      const user = await this.usersService.findUnique({ id: log.userId });

      return new LogEntity(log, { ...(user && { user }) });
    }

    return new LogEntity(log);
  }
}

export default LoggingController;
