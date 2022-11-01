import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  PermissionsByRole,
  UUID,
  UserRole,
} from '@indocal/services';

export interface UserRolePermissionsByRoleHookReturn {
  loading: boolean;
  validating: boolean;
  role: PermissionsByRole['role'] | null;
  permissions: PermissionsByRole['permissions'] | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useUserRolePermissionsByRole(
  role: UUID | UserRole
): UserRolePermissionsByRoleHookReturn {
  const query = useMemo(
    () =>
      qs.stringify({
        role: typeof role === 'string' ? role : role.id,
      }),
    [role]
  );

  const { isValidating, data, error, mutate } = useSWR<PermissionsByRole>(
    `?${query}`
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: typeof data === 'undefined' && !error,
    validating: isValidating,
    role: data?.role ?? null,
    permissions: data?.permissions ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useUserRolePermissionsByRole;
