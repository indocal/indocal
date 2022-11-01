import { AxiosResponse } from 'axios';

import { ServiceError, createServiceError, UUID } from '../../../../common';
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

export interface FindManyFormFieldsReturn {
  fields: FormField[];
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
        FormField,
        AxiosResponse<FormField, CreateFormFieldDto>,
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

  async findAll(form: UUID | Form): Promise<FindManyFormFieldsReturn> {
    try {
      const response = await this.config.axios.get<FormField[]>(
        `${ApiEndpoints.FORMS}/${this.getUUID(form)}/fields`
      );

      return {
        fields: response.data,
        error: null,
      };
    } catch (error) {
      return {
        fields: [],
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneFormFieldByUUIDReturn> {
    try {
      const response = await this.config.axios.get<FormField | null>(
        `${ApiEndpoints.FORMS}/fields/${id}`
      );

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
        FormField,
        AxiosResponse<FormField, UpdateFormFieldDto>,
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
      const response = await this.config.axios.delete<FormField>(
        `${ApiEndpoints.FORMS}/fields/${id}`
      );

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
