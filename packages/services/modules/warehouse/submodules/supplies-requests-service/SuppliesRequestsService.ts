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
  SupplyRequest,
  CreateSupplyRequestDto,
  CountSuppliesRequestsParamsDto,
  FindManySuppliesRequestsParamsDto,
  DispatchItemsDto,
} from './types';

import { SuppliesRequestsItemsService } from '../supplies-requests-items-service';

export interface CreateSupplyRequestReturn {
  request: SupplyRequest | null;
  error: ServiceError | null;
}

export interface CountSuppliesRequestsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManySuppliesRequestsReturn {
  requests: SupplyRequest[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneSupplyRequestByUUIDReturn {
  request: SupplyRequest | null;
  error: ServiceError | null;
}

export interface DispatchItemsReturn {
  error: ServiceError | null;
}

export class SuppliesRequestsService {
  items: SuppliesRequestsItemsService;

  constructor(private config: Config) {
    this.items = new SuppliesRequestsItemsService(config);
  }

  async create(
    data: CreateSupplyRequestDto
  ): Promise<CreateSupplyRequestReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<SupplyRequest>,
        AxiosResponse<
          SingleEntityResponse<SupplyRequest>,
          CreateSupplyRequestDto
        >,
        CreateSupplyRequestDto
      >(ApiEndpoints.SUPPLIES_REQUESTS, data);

      return {
        request: response.data,
        error: null,
      };
    } catch (error) {
      return {
        request: null,
        error: createServiceError(error),
      };
    }
  }

  async count(
    params?: CountSuppliesRequestsParamsDto
  ): Promise<CountSuppliesRequestsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.SUPPLIES_REQUESTS_COUNT,
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
    params?: FindManySuppliesRequestsParamsDto
  ): Promise<FindManySuppliesRequestsReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<SupplyRequest>
      >(ApiEndpoints.SUPPLIES_REQUESTS, { params });

      return {
        requests: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        requests: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneSupplyRequestByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<SupplyRequest | null>
      >(`${ApiEndpoints.SUPPLIES_REQUESTS}/${id}`);

      return {
        request: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        request: null,
        error: createServiceError(error),
      };
    }
  }

  async dispatchItems(data: DispatchItemsDto): Promise<DispatchItemsReturn> {
    try {
      await this.config.axios.patch<
        void,
        AxiosResponse<void, DispatchItemsDto>,
        DispatchItemsDto
      >(`${ApiEndpoints.SUPPLIES_REQUESTS_ACTIONS}/dispatch-items`, data);

      return {
        error: null,
      };
    } catch (error) {
      return {
        error: createServiceError(error),
      };
    }
  }
}

export default SuppliesRequestsService;
