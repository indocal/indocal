import { AxiosResponse } from 'axios';

import { ServiceError, createServiceError, UUID } from '../../common';
import { Config, ApiEndpoints } from '../../config';

import {
  Form,
  CreateFormDto,
  UpdateFormDto,
  CountFormsParamsDto,
  FindManyFormsParamsDto,
} from './types';

import { FormsFieldsService } from './submodules';

export interface CreateFormReturn {
  form: Form | null;
  error: ServiceError | null;
}

export interface CountFormsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyFormsReturn {
  forms: Form[];
  error: ServiceError | null;
}

export interface FindOneFormByUUIDReturn {
  form: Form | null;
  error: ServiceError | null;
}

export interface UpdateFormReturn {
  form: Form | null;
  error: ServiceError | null;
}

export interface DeleteFormReturn {
  form: Form | null;
  error: ServiceError | null;
}

export class FormsService {
  fields: FormsFieldsService;

  constructor(private config: Config) {
    this.fields = new FormsFieldsService(config);
  }

  async create(data: CreateFormDto): Promise<CreateFormReturn> {
    try {
      const response = await this.config.axios.post<
        Form,
        AxiosResponse<Form, CreateFormDto>,
        CreateFormDto
      >(ApiEndpoints.FORMS, data);

      return {
        form: response.data,
        error: null,
      };
    } catch (error) {
      return {
        form: null,
        error: createServiceError(error),
      };
    }
  }

  async count(params?: CountFormsParamsDto): Promise<CountFormsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.FORMS_COUNT,
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
    params?: FindManyFormsParamsDto
  ): Promise<FindManyFormsReturn> {
    try {
      const response = await this.config.axios.get<Form[]>(ApiEndpoints.FORMS, {
        params,
      });

      return {
        forms: response.data,
        error: null,
      };
    } catch (error) {
      return {
        forms: [],
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneFormByUUIDReturn> {
    try {
      const response = await this.config.axios.get<Form | null>(
        `${ApiEndpoints.FORMS}/${id}`
      );

      return {
        form: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        form: null,
        error: createServiceError(error),
      };
    }
  }

  async update(id: UUID, data: UpdateFormDto): Promise<UpdateFormReturn> {
    try {
      const response = await this.config.axios.patch<
        Form,
        AxiosResponse<Form, UpdateFormDto>,
        UpdateFormDto
      >(`${ApiEndpoints.FORMS}/${id}`, data);

      return {
        form: response.data,
        error: null,
      };
    } catch (error) {
      return {
        form: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteFormReturn> {
    try {
      const response = await this.config.axios.delete<Form>(
        `${ApiEndpoints.FORMS}/${id}`
      );

      return {
        form: response.data,
        error: null,
      };
    } catch (error) {
      return {
        form: null,
        error: createServiceError(error),
      };
    }
  }
}

export default FormsService;
