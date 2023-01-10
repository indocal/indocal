import { AxiosResponse } from 'axios';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
  MultipleEntitiesResponse,
} from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import { Form } from '../../types';

import { FormField, CreateFormFieldDto, UpdateFormFieldDto } from './types';

export interface CreateFormFieldReturn {
  field: FormField | null;
  error: ServiceError | null;
}

export interface CountFormFieldsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindAllFormFieldsReturn {
  fields: FormField[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneFormFieldByUUIDReturn {
  field: FormField | null;
  error: ServiceError | null;
}

export interface UpdateFormFieldReturn {
  field: FormField | null;
  error: ServiceError | null;
}

export interface DeleteFormFieldReturn {
  field: FormField | null;
  error: ServiceError | null;
}

export class FormsFieldsService {
  constructor(private config: Config) {}

  private getUUID(form: UUID | Form): UUID {
    return typeof form === 'string' ? form : form.id;
  }

  async create(
    form: UUID | Form,
    data: CreateFormFieldDto
  ): Promise<CreateFormFieldReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<FormField>,
        AxiosResponse<SingleEntityResponse<FormField>, CreateFormFieldDto>,
        CreateFormFieldDto
      >(`${ApiEndpoints.FORMS}/${this.getUUID(form)}/fields`, data);

      return {
        field: response.data,
        error: null,
      };
    } catch (error) {
      return {
        field: null,
        error: createServiceError(error),
      };
    }
  }

  async count(form: UUID | Form): Promise<CountFormFieldsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        `${ApiEndpoints.FORMS}/${this.getUUID(form)}/fields/count`
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

  async findAll(form: UUID | Form): Promise<FindAllFormFieldsReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<FormField>
      >(`${ApiEndpoints.FORMS}/${this.getUUID(form)}/fields`);

      return {
        fields: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        fields: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneFormFieldByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<FormField | null>
      >(`${ApiEndpoints.FORMS}/fields/${id}`);

      return {
        field: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        field: null,
        error: createServiceError(error),
      };
    }
  }

  async update(
    id: UUID,
    data: UpdateFormFieldDto
  ): Promise<UpdateFormFieldReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<FormField>,
        AxiosResponse<SingleEntityResponse<FormField>, UpdateFormFieldDto>,
        UpdateFormFieldDto
      >(`${ApiEndpoints.FORMS}/fields/${id}`, data);

      return {
        field: response.data,
        error: null,
      };
    } catch (error) {
      return {
        field: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteFormFieldReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<FormField>
      >(`${ApiEndpoints.FORMS}/fields/${id}`);

      return {
        field: response.data,
        error: null,
      };
    } catch (error) {
      return {
        field: null,
        error: createServiceError(error),
      };
    }
  }
}

export default FormsFieldsService;
