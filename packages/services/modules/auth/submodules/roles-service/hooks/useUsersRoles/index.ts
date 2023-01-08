import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { UserRole, FindManyUsersRolesParamsDto } from '../../types';

export interface UsersRolesHookReturn {
  loading: boolean;
  validating: boolean;
  roles: UserRole[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useUsersRoles(
  params?: FindManyUsersRolesParamsDto
): UsersRolesHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<UserRole>
  >(params ? `${ApiEndpoints.USERS_ROLES}?${query}` : ApiEndpoints.USERS_ROLES);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    roles: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useUsersRoles;
