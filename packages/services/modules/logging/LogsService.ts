import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
  MultipleEntitiesResponse,
} from '../../common';
import { Config, ApiEndpoints } from '../../config';

import { Log, CountLogsParamsDto, FindManyLogsParamsDto } from './types';

export interface CountLogsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyLogsReturn {
  logs: Log[];
  count: number;
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
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<Log>
      >(ApiEndpoints.LOGS, {
        params,
      });

      return {
        logs: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        logs: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneLogByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<Log | null>
      >(`${ApiEndpoints.LOGS}/${id}`);

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
