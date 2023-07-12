import { AxiosResponse } from 'axios';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import { Service } from '../../types';

import {
  ServiceCertificateTemplate,
  UpsertServiceCertificateTemplateDto,
} from './types';

export interface FindOneServiceCertificateTemplateByUUIDReturn {
  template: ServiceCertificateTemplate | null;
  error: ServiceError | null;
}

export interface UpsertServiceCertificateTemplateReturn {
  template: ServiceCertificateTemplate | null;
  error: ServiceError | null;
}

export interface DeleteServiceCertificateTemplateReturn {
  template: ServiceCertificateTemplate | null;
  error: ServiceError | null;
}

export class ServicesCertificatesTemplatesService {
  constructor(private config: Config) {}

  private getUUID(service: UUID | Service): UUID {
    return typeof service === 'string' ? service : service.id;
  }

  async findOneByUUID(
    id: UUID
  ): Promise<FindOneServiceCertificateTemplateByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<ServiceCertificateTemplate | null>
      >(`${ApiEndpoints.SERVICES}/templates/${id}`);

      return {
        template: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        template: null,
        error: createServiceError(error),
      };
    }
  }

  async upsert(
    service: UUID | Service,
    data: UpsertServiceCertificateTemplateDto
  ): Promise<UpsertServiceCertificateTemplateReturn> {
    try {
      const response = await this.config.axios.put<
        SingleEntityResponse<ServiceCertificateTemplate>,
        AxiosResponse<
          SingleEntityResponse<ServiceCertificateTemplate>,
          UpsertServiceCertificateTemplateDto
        >,
        UpsertServiceCertificateTemplateDto
      >(`${ApiEndpoints.SERVICES}/${this.getUUID(service)}/templates`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return {
        template: response.data,
        error: null,
      };
    } catch (error) {
      return {
        template: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteServiceCertificateTemplateReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<ServiceCertificateTemplate>
      >(`${ApiEndpoints.SERVICES}/templates/${id}`);

      return {
        template: response.data,
        error: null,
      };
    } catch (error) {
      return {
        template: null,
        error: createServiceError(error),
      };
    }
  }
}

export default ServicesCertificatesTemplatesService;
