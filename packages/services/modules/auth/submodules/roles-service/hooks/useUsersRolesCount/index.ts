import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import { ServiceError, createServiceError } from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { UserRole, CountUsersRolesParamsDto } from '../../types';

export interface UsersRolesCountHookReturn {
  loading: boolean;
  validating: boolean;
  roles: UserRole[];
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useUsersRolesCount(
  params?: CountUsersRolesParamsDto
): UsersRolesCountHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isValidating, data, error, mutate } = useSWR<UserRole[]>(
    params
      ? `${ApiEndpoints.USERS_ROLES_COUNT}?${query}`
      : ApiEndpoints.USERS_ROLES_COUNT
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: typeof data === 'undefined' && !error,
    validating: isValidating,
    roles: data ?? [],
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useUsersRolesCount;
