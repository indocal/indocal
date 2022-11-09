import { AxiosResponse } from 'axios';

import { ServiceError, createServiceError, UUID } from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import { UserRole } from '../roles-service';

import {
  UserRolePermission,
  CreateUserRolePermissionDto,
  UpdateUserRolePermissionDto,
} from './types';

export interface CreateUserRolePermissionReturn {
  permission: UserRolePermission | null;
  error: ServiceError | null;
}

export interface CountUserRolePermissionsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindAllUserRolePermissionsReturn {
  permissions: UserRolePermission[];
  error: ServiceError | null;
}

export interface FindOneUserRolePermissionByUUIDReturn {
  permission: UserRolePermission | null;
  error: ServiceError | null;
}

export interface UpdateUserRolePermissionReturn {
  permission: UserRolePermission | null;
  error: ServiceError | null;
}

export interface DeleteUserRolePermissionReturn {
  permission: UserRolePermission | null;
  error: ServiceError | null;
}

export class UsersRolesPermissionsService {
  constructor(private config: Config) {}

  private getUUID(role: UUID | UserRole): UUID {
    return typeof role === 'string' ? role : role.id;
  }

  async create(
    role: UUID | UserRole,
    data: CreateUserRolePermissionDto
  ): Promise<CreateUserRolePermissionReturn> {
    try {
      const response = await this.config.axios.post<
        UserRolePermission,
        AxiosResponse<UserRolePermission, CreateUserRolePermissionDto>,
        CreateUserRolePermissionDto
      >(`${ApiEndpoints.USERS_ROLES}/${this.getUUID(role)}/permissions`, data);

      return {
        permission: response.data,
        error: null,
      };
    } catch (error) {
      return {
        permission: null,
        error: createServiceError(error),
      };
    }
  }

  async count(role: UUID | UserRole): Promise<CountUserRolePermissionsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        `${ApiEndpoints.USERS_ROLES}/${this.getUUID(role)}/permissions/count`
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

  async findAll(
    role: UUID | UserRole
  ): Promise<FindAllUserRolePermissionsReturn> {
    try {
      const response = await this.config.axios.get<UserRolePermission[]>(
        `${ApiEndpoints.USERS_ROLES}/${this.getUUID(role)}/permissions`
      );

      return {
        permissions: response.data,
        error: null,
      };
    } catch (error) {
      return {
        permissions: [],
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(
    id: UUID
  ): Promise<FindOneUserRolePermissionByUUIDReturn> {
    try {
      const response = await this.config.axios.get<UserRolePermission | null>(
        `${ApiEndpoints.USERS_ROLES}/permissions/${id}`
      );

      return {
        permission: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        permission: null,
        error: createServiceError(error),
      };
    }
  }

  async update(
    id: UUID,
    data: UpdateUserRolePermissionDto
  ): Promise<UpdateUserRolePermissionReturn> {
    try {
      const response = await this.config.axios.patch<
        UserRolePermission,
        AxiosResponse<UserRolePermission, UpdateUserRolePermissionDto>,
        UpdateUserRolePermissionDto
      >(`${ApiEndpoints.USERS_ROLES}/permissions/${id}`, data);

      return {
        permission: response.data,
        error: null,
      };
    } catch (error) {
      return {
        permission: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteUserRolePermissionReturn> {
    try {
      const response = await this.config.axios.delete<UserRolePermission>(
        `${ApiEndpoints.USERS_ROLES}/permissions/${id}`
      );

      return {
        permission: response.data,
        error: null,
      };
    } catch (error) {
      return {
        permission: null,
        error: createServiceError(error),
      };
    }
  }
}

export default UsersRolesPermissionsService;
