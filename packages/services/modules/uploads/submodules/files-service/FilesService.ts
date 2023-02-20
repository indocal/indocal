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
  File as ApiFile,
  UpdateFileDto,
  CountFilesParamsDto,
  FindManyFilesParamsDto,
} from './types';

export interface UploadFilesReturn {
  files: ApiFile[];
  count: number;
  error: ServiceError | null;
}

export interface CountFilesReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyFilesReturn {
  files: ApiFile[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneFileByUUIDReturn {
  file: ApiFile | null;
  error: ServiceError | null;
}

export interface UpdateFileReturn {
  file: ApiFile | null;
  error: ServiceError | null;
}

export interface DeleteFileReturn {
  file: ApiFile | null;
  error: ServiceError | null;
}

export class FilesService {
  constructor(private config: Config) {}

  async upload(data: File[]): Promise<UploadFilesReturn> {
    try {
      const response = await this.config.axios.post<
        MultipleEntitiesResponse<ApiFile>,
        AxiosResponse<MultipleEntitiesResponse<ApiFile>, File[]>,
        File[]
      >(ApiEndpoints.FILES, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        files: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        files: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async count(params?: CountFilesParamsDto): Promise<CountFilesReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.FILES_COUNT,
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
    params?: FindManyFilesParamsDto
  ): Promise<FindManyFilesReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<ApiFile>
      >(ApiEndpoints.FILES, { params });

      return {
        files: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        files: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneFileByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<ApiFile | null>
      >(`${ApiEndpoints.FILES}/${id}`);

      return {
        file: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        file: null,
        error: createServiceError(error),
      };
    }
  }

  async update(id: UUID, data: UpdateFileDto): Promise<UpdateFileReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<ApiFile>,
        AxiosResponse<SingleEntityResponse<ApiFile>, UpdateFileDto>,
        UpdateFileDto
      >(`${ApiEndpoints.FILES}/${id}`, data);

      return {
        file: response.data,
        error: null,
      };
    } catch (error) {
      return {
        file: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteFileReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<ApiFile>
      >(`${ApiEndpoints.FILES}/${id}`);

      return {
        file: response.data,
        error: null,
      };
    } catch (error) {
      return {
        file: null,
        error: createServiceError(error),
      };
    }
  }
}

export default FilesService;
