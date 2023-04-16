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
  ServiceRequest,
  CreateServiceRequestDto,
  UpdateServiceRequestDto,
  CountServicesRequestsParamsDto,
  FindManyServicesRequestsParamsDto,
} from './types';

export interface CreateServiceRequestReturn {
  request: ServiceRequest | null;
  error: ServiceError | null;
}

export interface CountServicesRequestsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyServicesRequestsReturn {
  requests: ServiceRequest[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneServiceRequestByUUIDReturn {
  request: ServiceRequest | null;
  error: ServiceError | null;
}

export interface UpdateServiceRequestReturn {
  request: ServiceRequest | null;
  error: ServiceError | null;
}

export interface DeleteServiceRequestReturn {
  request: ServiceRequest | null;
  error: ServiceError | null;
}

export class ServicesRequestsService {
  constructor(private config: Config) {}

  async create(
    data: CreateServiceRequestDto
  ): Promise<CreateServiceRequestReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<ServiceRequest>,
        AxiosResponse<
          SingleEntityResponse<ServiceRequest>,
          CreateServiceRequestDto
        >,
        CreateServiceRequestDto
      >(ApiEndpoints.SERVICES_REQUESTS, data);

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
    params?: CountServicesRequestsParamsDto
  ): Promise<CountServicesRequestsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.SERVICES_REQUESTS_COUNT,
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
    params?: FindManyServicesRequestsParamsDto
  ): Promise<FindManyServicesRequestsReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<ServiceRequest>
      >(ApiEndpoints.SERVICES_REQUESTS, { params });

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

  async findOneByUUID(id: UUID): Promise<FindOneServiceRequestByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<ServiceRequest | null>
      >(`${ApiEndpoints.SERVICES_REQUESTS}/${id}`);

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

  async update(
    id: UUID,
    data: UpdateServiceRequestDto
  ): Promise<UpdateServiceRequestReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<ServiceRequest | null>
      >(`${ApiEndpoints.SERVICES_REQUESTS}/${id}`, data);

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

  async delete(id: UUID): Promise<DeleteServiceRequestReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<ServiceRequest | null>
      >(`${ApiEndpoints.SERVICES_REQUESTS}/${id}`);

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
}

export default ServicesRequestsService;
