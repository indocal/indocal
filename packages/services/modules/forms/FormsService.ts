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
  Form,
  CreateFormDto,
  UpdateFormDto,
  CountFormsParamsDto,
  FindManyFormsParamsDto,
  FormEntriesPerMonth,
  FormFieldReport,
  CalcFormEntriesPerMonthParamsDto,
  CalcFormFieldsReportsParamsDto,
} from './types';

import { FormsFieldsService, FormsEntriesService } from './submodules';

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
  count: number;
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

export interface CalcFormEntriesPerMonthReturn {
  entriesPerMonth: FormEntriesPerMonth[];
  error: ServiceError | null;
}

export interface CalcFormFieldsReportsReturn {
  reports: FormFieldReport[];
  error: ServiceError | null;
}

export class FormsService {
  fields: FormsFieldsService;
  entries: FormsEntriesService;

  constructor(private config: Config) {
    this.fields = new FormsFieldsService(config);
    this.entries = new FormsEntriesService(config);
  }

  async create(data: CreateFormDto): Promise<CreateFormReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<Form>,
        AxiosResponse<SingleEntityResponse<Form>, CreateFormDto>,
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
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<Form>
      >(ApiEndpoints.FORMS, {
        params,
      });

      return {
        forms: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        forms: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneFormByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<Form | null>
      >(`${ApiEndpoints.FORMS}/${id}`);

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
        SingleEntityResponse<Form>,
        AxiosResponse<SingleEntityResponse<Form>, UpdateFormDto>,
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
      const response = await this.config.axios.delete<
        SingleEntityResponse<Form>
      >(`${ApiEndpoints.FORMS}/${id}`);

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

  async calcFormEntriesPerMonth(
    id: UUID,
    params?: CalcFormEntriesPerMonthParamsDto
  ): Promise<CalcFormEntriesPerMonthReturn> {
    try {
      const response = await this.config.axios.get<FormEntriesPerMonth[]>(
        `${ApiEndpoints.FORMS}/${id}/stats/entries-per-month`,
        { params }
      );

      return {
        entriesPerMonth: response.data,
        error: null,
      };
    } catch (error) {
      return {
        entriesPerMonth: [],
        error: createServiceError(error),
      };
    }
  }

  async calcFormFieldsReports(
    id: UUID,
    params?: CalcFormFieldsReportsParamsDto
  ): Promise<CalcFormFieldsReportsReturn> {
    try {
      const response = await this.config.axios.get<FormFieldReport[]>(
        `${ApiEndpoints.FORMS}/${id}/stats/fields-reports`,
        { params }
      );

      return {
        reports: response.data,
        error: null,
      };
    } catch (error) {
      return {
        reports: [],
        error: createServiceError(error),
      };
    }
  }
}

export default FormsService;
