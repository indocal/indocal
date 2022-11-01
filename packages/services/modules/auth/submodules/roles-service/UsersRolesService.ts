import { AxiosResponse } from 'axios';

import { ServiceError, createServiceError, UUID } from '../../../../common';
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
        UserRole,
        AxiosResponse<UserRole, CreateUserRoleDto>,
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
      const response = await this.config.axios.get<UserRole[]>(
        ApiEndpoints.USERS_ROLES,
        { params }
      );

      return {
        roles: response.data,
        error: null,
      };
    } catch (error) {
      return {
        roles: [],
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneUserRoleByUUIDReturn> {
    try {
      const response = await this.config.axios.get<UserRole | null>(
        `${ApiEndpoints.USERS_ROLES}/${id}`
      );

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
        UserRole,
        AxiosResponse<UserRole, UpdateUserRoleDto>,
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
      const response = await this.config.axios.delete<UserRole>(
        `${ApiEndpoints.USERS_ROLES}/${id}`
      );

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
