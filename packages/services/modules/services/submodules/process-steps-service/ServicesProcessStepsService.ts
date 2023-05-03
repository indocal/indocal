import { AxiosResponse } from 'axios';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
  MultipleEntitiesResponse,
} from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import { Service } from '../../types';

import {
  ServiceProcessStep,
  CreateServiceProcessStepDto,
  UpdateServiceProcessStepDto,
} from './types';

export interface CreateServiceProcessStepReturn {
  step: ServiceProcessStep | null;
  error: ServiceError | null;
}

export interface CountServiceProcessStepsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindAllServiceProcessStepsReturn {
  steps: ServiceProcessStep[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneServiceProcessStepByUUIDReturn {
  step: ServiceProcessStep | null;
  error: ServiceError | null;
}

export interface UpdateServiceProcessStepReturn {
  step: ServiceProcessStep | null;
  error: ServiceError | null;
}

export interface DeleteServiceProcessStepReturn {
  step: ServiceProcessStep | null;
  error: ServiceError | null;
}

export class ServicesProcessStepsService {
  constructor(private config: Config) {}

  private getUUID(service: UUID | Service): UUID {
    return typeof service === 'string' ? service : service.id;
  }

  async create(
    service: UUID | Service,
    data: CreateServiceProcessStepDto
  ): Promise<CreateServiceProcessStepReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<ServiceProcessStep>,
        AxiosResponse<
          SingleEntityResponse<ServiceProcessStep>,
          CreateServiceProcessStepDto
        >,
        CreateServiceProcessStepDto
      >(`${ApiEndpoints.SERVICES}/${this.getUUID(service)}/steps`, data);

      return {
        step: response.data,
        error: null,
      };
    } catch (error) {
      return {
        step: null,
        error: createServiceError(error),
      };
    }
  }

  async count(
    service: UUID | Service
  ): Promise<CountServiceProcessStepsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        `${ApiEndpoints.SERVICES}/${this.getUUID(service)}/steps/count`
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

  async findAll(
    service: UUID | Service
  ): Promise<FindAllServiceProcessStepsReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<ServiceProcessStep>
      >(`${ApiEndpoints.SERVICES}/${this.getUUID(service)}/steps`);

      return {
        steps: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        steps: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(
    id: UUID
  ): Promise<FindOneServiceProcessStepByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<ServiceProcessStep | null>
      >(`${ApiEndpoints.SERVICES}/steps/${id}`);

      return {
        step: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        step: null,
        error: createServiceError(error),
      };
    }
  }

  async update(
    id: UUID,
    data: UpdateServiceProcessStepDto
  ): Promise<UpdateServiceProcessStepReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<ServiceProcessStep>,
        AxiosResponse<
          SingleEntityResponse<ServiceProcessStep>,
          UpdateServiceProcessStepDto
        >,
        UpdateServiceProcessStepDto
      >(`${ApiEndpoints.SERVICES}/steps/${id}`, data);

      return {
        step: response.data,
        error: null,
      };
    } catch (error) {
      return {
        step: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteServiceProcessStepReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<ServiceProcessStep>
      >(`${ApiEndpoints.SERVICES}/steps/${id}`);

      return {
        step: response.data,
        error: null,
      };
    } catch (error) {
      return {
        step: null,
        error: createServiceError(error),
      };
    }
  }
}

export default ServicesProcessStepsService;
