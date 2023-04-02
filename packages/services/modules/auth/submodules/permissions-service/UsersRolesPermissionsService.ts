import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
  MultipleEntitiesResponse,
} from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import { UserRole } from '../roles-service';

import { UserRolePermission } from './types';

export interface CountUserRolePermissionsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindAllUserRolePermissionsReturn {
  permissions: UserRolePermission[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneUserRolePermissionByUUIDReturn {
  permission: UserRolePermission | null;
  error: ServiceError | null;
}

export class UsersRolesPermissionsService {
  constructor(private config: Config) {}

  private getUUID(role: UUID | UserRole): UUID {
    return typeof role === 'string' ? role : role.id;
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
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<UserRolePermission>
      >(`${ApiEndpoints.USERS_ROLES}/${this.getUUID(role)}/permissions`);

      return {
        permissions: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        permissions: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(
    id: UUID
  ): Promise<FindOneUserRolePermissionByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<UserRolePermission | null>
      >(`${ApiEndpoints.USERS_ROLES}/permissions/${id}`);

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
}

export default UsersRolesPermissionsService;
