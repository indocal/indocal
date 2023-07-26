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
  ServiceCertificate,
  CreateServiceCertificateDto,
  UpdateServiceCertificateDto,
  CountServicesCertificatesParamsDto,
  FindManyServicesCertificatesParamsDto,
} from './types';

export interface CreateServiceCertificateReturn {
  certificate: ServiceCertificate | null;
  error: ServiceError | null;
}

export interface CountServicesCertificatesReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyServicesCertificatesReturn {
  certificates: ServiceCertificate[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneServiceCertificateByUUIDReturn {
  certificate: ServiceCertificate | null;
  error: ServiceError | null;
}

export interface UpdateServiceCertificateReturn {
  certificate: ServiceCertificate | null;
  error: ServiceError | null;
}

export interface DeleteServiceCertificateReturn {
  certificate: ServiceCertificate | null;
  error: ServiceError | null;
}

export class ServicesCertificatesService {
  constructor(private config: Config) {}

  async create(
    data: CreateServiceCertificateDto
  ): Promise<CreateServiceCertificateReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<ServiceCertificate>,
        AxiosResponse<
          SingleEntityResponse<ServiceCertificate>,
          CreateServiceCertificateDto
        >,
        CreateServiceCertificateDto
      >(ApiEndpoints.SERVICES_CERTIFICATES, data);

      return {
        certificate: response.data,
        error: null,
      };
    } catch (error) {
      return {
        certificate: null,
        error: createServiceError(error),
      };
    }
  }

  async count(
    params?: CountServicesCertificatesParamsDto
  ): Promise<CountServicesCertificatesReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.SERVICES_CERTIFICATES_COUNT,
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
    params?: FindManyServicesCertificatesParamsDto
  ): Promise<FindManyServicesCertificatesReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<ServiceCertificate>
      >(ApiEndpoints.SERVICES_CERTIFICATES, { params });

      return {
        certificates: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        certificates: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(
    id: UUID
  ): Promise<FindOneServiceCertificateByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<ServiceCertificate | null>
      >(`${ApiEndpoints.SERVICES_CERTIFICATES}/${id}`);

      return {
        certificate: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        certificate: null,
        error: createServiceError(error),
      };
    }
  }

  async update(
    id: UUID,
    data: UpdateServiceCertificateDto
  ): Promise<UpdateServiceCertificateReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<ServiceCertificate | null>
      >(`${ApiEndpoints.SERVICES_CERTIFICATES}/${id}`, data);

      return {
        certificate: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        certificate: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteServiceCertificateReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<ServiceCertificate | null>
      >(`${ApiEndpoints.SERVICES_CERTIFICATES}/${id}`);

      return {
        certificate: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        certificate: null,
        error: createServiceError(error),
      };
    }
  }
}

export default ServicesCertificatesService;
