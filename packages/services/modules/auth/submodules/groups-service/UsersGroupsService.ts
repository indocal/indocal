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
  UserGroup,
  CreateUserGroupDto,
  UpdateUserGroupDto,
  CountUsersGroupsParamsDto,
  FindManyUsersGroupsParamsDto,
} from './types';

export interface CreateUserGroupReturn {
  group: UserGroup | null;
  error: ServiceError | null;
}

export interface CountUsersGroupsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyUsersGroupsReturn {
  groups: UserGroup[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneUserGroupByUUIDReturn {
  group: UserGroup | null;
  error: ServiceError | null;
}

export interface UpdateUserGroupReturn {
  group: UserGroup | null;
  error: ServiceError | null;
}

export interface DeleteUserGroupReturn {
  group: UserGroup | null;
  error: ServiceError | null;
}

export class UsersGroupsService {
  constructor(private config: Config) {}

  async create(data: CreateUserGroupDto): Promise<CreateUserGroupReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<UserGroup>,
        AxiosResponse<SingleEntityResponse<UserGroup>, CreateUserGroupDto>,
        CreateUserGroupDto
      >(ApiEndpoints.USERS_GROUPS, data);

      return {
        group: response.data,
        error: null,
      };
    } catch (error) {
      return {
        group: null,
        error: createServiceError(error),
      };
    }
  }

  async count(
    params?: CountUsersGroupsParamsDto
  ): Promise<CountUsersGroupsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.USERS_GROUPS_COUNT,
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
    params?: FindManyUsersGroupsParamsDto
  ): Promise<FindManyUsersGroupsReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<UserGroup>
      >(ApiEndpoints.USERS_GROUPS, { params });

      return {
        groups: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        groups: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneUserGroupByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<UserGroup | null>
      >(`${ApiEndpoints.USERS_GROUPS}/${id}`);

      return {
        group: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        group: null,
        error: createServiceError(error),
      };
    }
  }

  async update(
    id: UUID,
    data: UpdateUserGroupDto
  ): Promise<UpdateUserGroupReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<UserGroup>,
        AxiosResponse<SingleEntityResponse<UserGroup>, UpdateUserGroupDto>,
        UpdateUserGroupDto
      >(`${ApiEndpoints.USERS_GROUPS}/${id}`, data);

      return {
        group: response.data,
        error: null,
      };
    } catch (error) {
      return {
        group: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteUserGroupReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<UserGroup>
      >(`${ApiEndpoints.USERS_GROUPS}/${id}`);

      return {
        group: response.data,
        error: null,
      };
    } catch (error) {
      return {
        group: null,
        error: createServiceError(error),
      };
    }
  }
}

export default UsersGroupsService;
