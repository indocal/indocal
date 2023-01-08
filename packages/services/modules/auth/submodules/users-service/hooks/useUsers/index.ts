import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { User, FindManyUsersParamsDto } from '../../types';

export interface UsersHookReturn {
  loading: boolean;
  validating: boolean;
  users: User[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useUsers(params?: FindManyUsersParamsDto): UsersHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<User>
  >(params ? `${ApiEndpoints.USERS}?${query}` : ApiEndpoints.USERS);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    users: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useUsers;
