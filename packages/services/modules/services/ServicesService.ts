import { AxiosResponse } from 'axios';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
  MultipleEntitiesResponse,
} from '../../common';
import { Config, ApiEndpoints } from '../../config';

import {
  Service,
  CreateServiceDto,
  UpdateServiceDto,
  CountServicesParamsDto,
  FindManyServicesParamsDto,
} from './types';

import {
  ServicesProcessStepsService,
  ServicesRequestsService,
} from './submodules';

export interface CreateServiceReturn {
  service: Service | null;
  error: ServiceError | null;
}

export interface CountServicesReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyServicesReturn {
  services: Service[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneServiceByUUIDReturn {
  service: Service | null;
  error: ServiceError | null;
}

export interface UpdateServiceReturn {
  service: Service | null;
  error: ServiceError | null;
}

export interface DeleteServiceReturn {
  service: Service | null;
  error: ServiceError | null;
}

export class ServicesService {
  steps: ServicesProcessStepsService;
  requests: ServicesRequestsService;

  constructor(private config: Config) {
    this.steps = new ServicesProcessStepsService(config);
    this.requests = new ServicesRequestsService(config);
  }

  async create(data: CreateServiceDto): Promise<CreateServiceReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<Service>,
        AxiosResponse<SingleEntityResponse<Service>, CreateServiceDto>,
        CreateServiceDto
      >(ApiEndpoints.SERVICES, data);

      return {
        service: response.data,
        error: null,
      };
    } catch (error) {
      return {
        service: null,
        error: createServiceError(error),
      };
    }
  }

  async count(params?: CountServicesParamsDto): Promise<CountServicesReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.SERVICES_COUNT,
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
    params?: FindManyServicesParamsDto
  ): Promise<FindManyServicesReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<Service>
      >(ApiEndpoints.SERVICES, {
        params,
      });

      return {
        services: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        services: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneServiceByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<Service | null>
      >(`${ApiEndpoints.SERVICES}/${id}`);

      return {
        service: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        service: null,
        error: createServiceError(error),
      };
    }
  }

  async update(id: UUID, data: UpdateServiceDto): Promise<UpdateServiceReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<Service>,
        AxiosResponse<SingleEntityResponse<Service>, UpdateServiceDto>,
        UpdateServiceDto
      >(`${ApiEndpoints.SERVICES}/${id}`, data);

      return {
        service: response.data,
        error: null,
      };
    } catch (error) {
      return {
        service: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteServiceReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<Service>
      >(`${ApiEndpoints.SERVICES}/${id}`);

      return {
        service: response.data,
        error: null,
      };
    } catch (error) {
      return {
        service: null,
        error: createServiceError(error),
      };
    }
  }
}

export default ServicesService;
