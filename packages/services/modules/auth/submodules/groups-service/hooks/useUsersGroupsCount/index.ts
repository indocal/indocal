import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import { ServiceError, createServiceError } from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { UserGroup, CountUsersGroupsParamsDto } from '../../types';

export interface UsersGroupsCountHookReturn {
  loading: boolean;
  validating: boolean;
  groups: UserGroup[];
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useUsersGroupsCount(
  params?: CountUsersGroupsParamsDto
): UsersGroupsCountHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isValidating, data, error, mutate } = useSWR<UserGroup[]>(
    params
      ? `${ApiEndpoints.USERS_GROUPS_COUNT}?${query}`
      : ApiEndpoints.USERS_GROUPS_COUNT
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: typeof data === 'undefined' && !error,
    validating: isValidating,
    groups: data ?? [],
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useUsersGroupsCount;
