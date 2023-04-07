import { AxiosResponse } from 'axios';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
  MultipleEntitiesResponse,
} from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import {
  ApiToken,
  CreateApiTokenDto,
  UpdateApiTokenDto,
  CountApiTokensParamsDto,
  FindManyApiTokensParamsDto,
} from './types';

export interface CreateApiTokenReturn {
  apiToken: ApiToken | null;
  error: ServiceError | null;
}

export interface CountApiTokensReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyApiTokensReturn {
  apiTokens: ApiToken[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneApiTokenByUUIDReturn {
  apiToken: ApiToken | null;
  error: ServiceError | null;
}

export interface UpdateApiTokenReturn {
  apiToken: ApiToken | null;
  error: ServiceError | null;
}

export interface DeleteApiTokenReturn {
  apiToken: ApiToken | null;
  error: ServiceError | null;
}

export class ApiTokensService {
  constructor(private config: Config) {}

  async create(data: CreateApiTokenDto): Promise<CreateApiTokenReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<ApiToken>,
        AxiosResponse<SingleEntityResponse<ApiToken>, CreateApiTokenDto>,
        CreateApiTokenDto
      >(ApiEndpoints.API_TOKENS, data);

      return {
        apiToken: response.data,
        error: null,
      };
    } catch (error) {
      return {
        apiToken: null,
        error: createServiceError(error),
      };
    }
  }

  async count(params?: CountApiTokensParamsDto): Promise<CountApiTokensReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.API_TOKENS_COUNT,
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

  async findMany(
    params?: FindManyApiTokensParamsDto
  ): Promise<FindManyApiTokensReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<ApiToken>
      >(ApiEndpoints.API_TOKENS, { params });

      return {
        apiTokens: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        apiTokens: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneApiTokenByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<ApiToken | null>
      >(`${ApiEndpoints.API_TOKENS}/${id}`);

      return {
        apiToken: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        apiToken: null,
        error: createServiceError(error),
      };
    }
  }

  async update(
    id: UUID,
    data: UpdateApiTokenDto
  ): Promise<UpdateApiTokenReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<ApiToken>,
        AxiosResponse<SingleEntityResponse<ApiToken>, UpdateApiTokenDto>,
        UpdateApiTokenDto
      >(`${ApiEndpoints.API_TOKENS}/${id}`, data);

      return {
        apiToken: response.data,
        error: null,
      };
    } catch (error) {
      return {
        apiToken: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteApiTokenReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<ApiToken>
      >(`${ApiEndpoints.API_TOKENS}/${id}`);

      return {
        apiToken: response.data,
        error: null,
      };
    } catch (error) {
      return {
        apiToken: null,
        error: createServiceError(error),
      };
    }
  }
}

export default ApiTokensService;
