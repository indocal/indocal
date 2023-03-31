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
  FormEntry,
  CreateFormEntryDto,
  CountFormsEntriesParamsDto,
  FindManyFormsEntriesParamsDto,
} from './types';

export interface CreateFormEntryReturn {
  entry: FormEntry | null;
  error: ServiceError | null;
}

export interface CountFormsEntriesReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyFormsEntriesReturn {
  entries: FormEntry[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneFormEntryByUUIDReturn {
  entry: FormEntry | null;
  error: ServiceError | null;
}

export interface DeleteFormEntryReturn {
  entry: FormEntry | null;
  error: ServiceError | null;
}

export class FormsEntriesService {
  constructor(private config: Config) {}

  async create(data: CreateFormEntryDto): Promise<CreateFormEntryReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<FormEntry>,
        AxiosResponse<SingleEntityResponse<FormEntry>, CreateFormEntryDto>,
        CreateFormEntryDto
      >(ApiEndpoints.FORMS_ENTRIES, data);

      return {
        entry: response.data,
        error: null,
      };
    } catch (error) {
      return {
        entry: null,
        error: createServiceError(error),
      };
    }
  }

  async count(
    params?: CountFormsEntriesParamsDto
  ): Promise<CountFormsEntriesReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.FORMS_ENTRIES_COUNT,
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
    params?: FindManyFormsEntriesParamsDto
  ): Promise<FindManyFormsEntriesReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<FormEntry>
      >(ApiEndpoints.FORMS_ENTRIES, { params });

      return {
        entries: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        entries: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneFormEntryByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<FormEntry | null>
      >(`${ApiEndpoints.FORMS_ENTRIES}/${id}`);

      return {
        entry: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        entry: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteFormEntryReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<FormEntry | null>
      >(`${ApiEndpoints.FORMS_ENTRIES}/${id}`);

      return {
        entry: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        entry: null,
        error: createServiceError(error),
      };
    }
  }
}

export default FormsEntriesService;
