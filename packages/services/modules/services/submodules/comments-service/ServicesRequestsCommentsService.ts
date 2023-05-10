import { AxiosResponse } from 'axios';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
  MultipleEntitiesResponse,
} from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import { ServiceRequest } from '../requests-service/types';

import {
  ServiceRequestComment,
  CreateServiceRequestCommentDto,
  UpdateServiceRequestCommentDto,
} from './types';

export interface CreateServiceRequestCommentReturn {
  comment: ServiceRequestComment | null;
  error: ServiceError | null;
}

export interface CountServiceRequestCommentsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindAllServiceRequestCommentsReturn {
  comments: ServiceRequestComment[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneServiceRequestCommentByUUIDReturn {
  comment: ServiceRequestComment | null;
  error: ServiceError | null;
}

export interface UpdateServiceRequestCommentReturn {
  comment: ServiceRequestComment | null;
  error: ServiceError | null;
}

export interface DeleteServiceRequestCommentReturn {
  comment: ServiceRequestComment | null;
  error: ServiceError | null;
}

export class ServicesRequestsCommentsService {
  constructor(private config: Config) {}

  private getUUID(request: UUID | ServiceRequest): UUID {
    return typeof request === 'string' ? request : request.id;
  }

  async create(
    request: UUID | ServiceRequest,
    data: CreateServiceRequestCommentDto
  ): Promise<CreateServiceRequestCommentReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<ServiceRequestComment>,
        AxiosResponse<
          SingleEntityResponse<ServiceRequestComment>,
          CreateServiceRequestCommentDto
        >,
        CreateServiceRequestCommentDto
      >(
        `${ApiEndpoints.SERVICES_REQUESTS}/${this.getUUID(request)}/comments`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      return {
        comment: response.data,
        error: null,
      };
    } catch (error) {
      return {
        comment: null,
        error: createServiceError(error),
      };
    }
  }

  async count(
    request: UUID | ServiceRequest
  ): Promise<CountServiceRequestCommentsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        `${ApiEndpoints.SERVICES_REQUESTS}/${this.getUUID(
          request
        )}/comments/count`
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
    request: UUID | ServiceRequest
  ): Promise<FindAllServiceRequestCommentsReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<ServiceRequestComment>
      >(`${ApiEndpoints.SERVICES_REQUESTS}/${this.getUUID(request)}/comments`);

      return {
        comments: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        comments: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(
    id: UUID
  ): Promise<FindOneServiceRequestCommentByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<ServiceRequestComment | null>
      >(`${ApiEndpoints.SERVICES_REQUESTS}/comments/${id}`);

      return {
        comment: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        comment: null,
        error: createServiceError(error),
      };
    }
  }

  async update(
    id: UUID,
    data: UpdateServiceRequestCommentDto
  ): Promise<UpdateServiceRequestCommentReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<ServiceRequestComment>,
        AxiosResponse<
          SingleEntityResponse<ServiceRequestComment>,
          UpdateServiceRequestCommentDto
        >,
        UpdateServiceRequestCommentDto
      >(`${ApiEndpoints.SERVICES_REQUESTS}/comments/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return {
        comment: response.data,
        error: null,
      };
    } catch (error) {
      return {
        comment: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteServiceRequestCommentReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<ServiceRequestComment>
      >(`${ApiEndpoints.SERVICES_REQUESTS}/comments/${id}`);

      return {
        comment: response.data,
        error: null,
      };
    } catch (error) {
      return {
        comment: null,
        error: createServiceError(error),
      };
    }
  }
}

export default ServicesRequestsCommentsService;
