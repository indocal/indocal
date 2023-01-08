import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { UserGroup, FindManyUsersGroupsParamsDto } from '../../types';

export interface UsersGroupsHookReturn {
  loading: boolean;
  validating: boolean;
  groups: UserGroup[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useUsersGroups(
  params?: FindManyUsersGroupsParamsDto
): UsersGroupsHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<UserGroup>
  >(
    params ? `${ApiEndpoints.USERS_GROUPS}?${query}` : ApiEndpoints.USERS_GROUPS
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    groups: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useUsersGroups;
