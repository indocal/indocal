import { AxiosResponse } from 'axios';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
  MultipleEntitiesResponse,
} from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import { UsersRolesPermissionsService } from '../permissions-service';

import {
  UserRole,
  CreateUserRoleDto,
  UpdateUserRoleDto,
  CountUsersRolesParamsDto,
  FindManyUsersRolesParamsDto,
} from './types';

export interface CreateUserRoleReturn {
  role: UserRole | null;
  error: ServiceError | null;
}

export interface CountUsersRolesReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyUsersRolesReturn {
  roles: UserRole[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneUserRoleByUUIDReturn {
  role: UserRole | null;
  error: ServiceError | null;
}

export interface UpdateUserRoleReturn {
  role: UserRole | null;
  error: ServiceError | null;
}

export interface DeleteUserRoleReturn {
  role: UserRole | null;
  error: ServiceError | null;
}

export class UsersRolesService {
  permissions: UsersRolesPermissionsService;

  constructor(private config: Config) {
    this.permissions = new UsersRolesPermissionsService(config);
  }

  async create(data: CreateUserRoleDto): Promise<CreateUserRoleReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<UserRole>,
        AxiosResponse<SingleEntityResponse<UserRole>, CreateUserRoleDto>,
        CreateUserRoleDto
      >(ApiEndpoints.USERS_ROLES, data);

      return {
        role: response.data,
        error: null,
      };
    } catch (error) {
      return {
        role: null,
        error: createServiceError(error),
      };
    }
  }

  async count(
    params?: CountUsersRolesParamsDto
  ): Promise<CountUsersRolesReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.USERS_ROLES_COUNT,
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
    params?: FindManyUsersRolesParamsDto
  ): Promise<FindManyUsersRolesReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<UserRole>
      >(ApiEndpoints.USERS_ROLES, { params });

      return {
        roles: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        roles: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneUserRoleByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<UserRole | null>
      >(`${ApiEndpoints.USERS_ROLES}/${id}`);

      return {
        role: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        role: null,
        error: createServiceError(error),
      };
    }
  }

  async update(
    id: UUID,
    data: UpdateUserRoleDto
  ): Promise<UpdateUserRoleReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<UserRole>,
        AxiosResponse<SingleEntityResponse<UserRole>, UpdateUserRoleDto>,
        UpdateUserRoleDto
      >(`${ApiEndpoints.USERS_ROLES}/${id}`, data);

      return {
        role: response.data,
        error: null,
      };
    } catch (error) {
      return {
        role: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteUserRoleReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<UserRole>
      >(`${ApiEndpoints.USERS_ROLES}/${id}`);

      return {
        role: response.data,
        error: null,
      };
    } catch (error) {
      return {
        role: null,
        error: createServiceError(error),
      };
    }
  }
}

export default UsersRolesService;
