import useSWR from 'swr/immutable';
import { createMongoAbility, RawRule } from '@casl/ability';

import {
  User,
  UserRole,
  UserRolePermission,
  UserGroup,
  Form,
  FormField,
  Event,
} from '../../../../modules';
import { ServiceError, createServiceError, UUID } from '../../../../common';
import { ApiEndpoints } from '../../../../config';

import { FindManyUsersRolesParamsDto } from '../../submodules/roles-service';
import { AuthenticatedUser } from '../../types';

type HasPermissionsFunction = (
  role: UUID | UserRole,
  target: string | string[]
) => boolean;

export interface CheckPermissionsHookReturn {
  hasPermissions: HasPermissionsFunction;
  error: ServiceError | null;
}

enum Action {
  COUNT = 'count',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

type Subjects =
  | 'user'
  | 'userRole'
  | 'userRolePermission'
  | 'userGroup'
  | 'form'
  | 'formField'
  | 'event';

// TODO: implement it
export function useCheckPermissions(): CheckPermissionsHookReturn {
  const { data, error } = useSWR<UserRole[]>(ApiEndpoints.USERS_ROLES);

  if (typeof data === 'undefined' && !error) {
    return {
      hasPermissions: () => false,
      error: null,
    };
  }

  if (error) {
    return {
      hasPermissions: () => false,
      error: createServiceError(error),
    };
  }

  return {
    hasPermissions: (role) => {
      const id = typeof role === 'string' ? role : role.id;

      const roles = data ?? [];

      const ability = createMongoAbility(
        roles
          .map((role) =>
            role.permissions.map((permission) => {
              const [subject, action] = permission.action.split('::');

              return { action, subject };
            })
          )
          .flat()
      );

      return true;
    },
    error: null,
  };
}

export default useCheckPermissions;
