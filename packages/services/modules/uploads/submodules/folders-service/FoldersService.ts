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
  Folder,
  CreateFolderDto,
  UpdateFolderDto,
  CountFoldersParamsDto,
  FindManyFoldersParamsDto,
} from './types';

export interface CreateFolderReturn {
  folder: Folder | null;
  error: ServiceError | null;
}

export interface CountFoldersReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyFoldersReturn {
  folders: Folder[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneFolderByUUIDReturn {
  folder: Folder | null;
  error: ServiceError | null;
}

export interface UpdateFolderReturn {
  folder: Folder | null;
  error: ServiceError | null;
}

export interface DeleteFolderReturn {
  folder: Folder | null;
  error: ServiceError | null;
}

export class FoldersService {
  constructor(private config: Config) {}

  async create(data: CreateFolderDto): Promise<CreateFolderReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<Folder>,
        AxiosResponse<SingleEntityResponse<Folder>, CreateFolderDto>,
        CreateFolderDto
      >(ApiEndpoints.FOLDERS, data);

      return {
        folder: response.data,
        error: null,
      };
    } catch (error) {
      return {
        folder: null,
        error: createServiceError(error),
      };
    }
  }

  async count(params?: CountFoldersParamsDto): Promise<CountFoldersReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.FOLDERS_COUNT,
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
    params?: FindManyFoldersParamsDto
  ): Promise<FindManyFoldersReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<Folder>
      >(ApiEndpoints.FOLDERS, { params });

      return {
        folders: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        folders: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneFolderByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<Folder | null>
      >(`${ApiEndpoints.FOLDERS}/${id}`);

      return {
        folder: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        folder: null,
        error: createServiceError(error),
      };
    }
  }

  async update(id: UUID, data: UpdateFolderDto): Promise<UpdateFolderReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<Folder>,
        AxiosResponse<SingleEntityResponse<Folder>, UpdateFolderDto>,
        UpdateFolderDto
      >(`${ApiEndpoints.FOLDERS}/${id}`, data);

      return {
        folder: response.data,
        error: null,
      };
    } catch (error) {
      return {
        folder: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteFolderReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<Folder>
      >(`${ApiEndpoints.FOLDERS}/${id}`);

      return {
        folder: response.data,
        error: null,
      };
    } catch (error) {
      return {
        folder: null,
        error: createServiceError(error),
      };
    }
  }
}

export default FoldersService;
