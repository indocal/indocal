import { ServiceError, createServiceError, UUID } from '../../common';
import { Config, ApiEndpoints } from '../../config';

import { Log, CountLogsParamsDto, FindManyLogsParamsDto } from './types';

export interface CountLogsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyLogsReturn {
  logs: Log[];
  error: ServiceError | null;
}

export interface FindOneLogByUUIDReturn {
  log: Log | null;
  error: ServiceError | null;
}

export class LogsService {
  constructor(private config: Config) {}

  async count(params?: CountLogsParamsDto): Promise<CountLogsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.LOGS_COUNT,
        { params }
      );

      return {
        count: response.data,
        error: null,
      };
    } catch (error) {
      return {
        count: null,
        error: createServiceError(error),
      };
    }
  }

  async findMany(params?: FindManyLogsParamsDto): Promise<FindManyLogsReturn> {
    try {
      const response = await this.config.axios.get<Log[]>(ApiEndpoints.LOGS, {
        params,
      });

      return {
        logs: response.data,
        error: null,
      };
    } catch (error) {
      return {
        logs: [],
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneLogByUUIDReturn> {
    try {
      const response = await this.config.axios.get<Log | null>(
        `${ApiEndpoints.LOGS}/${id}`
      );

      return {
        log: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        log: null,
        error: createServiceError(error),
      };
    }
  }
}

export default LogsService;
