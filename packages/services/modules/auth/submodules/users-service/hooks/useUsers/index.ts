import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import { ServiceError, createServiceError } from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { User, FindManyUsersParamsDto } from '../../types';

export interface UsersHookReturn {
  loading: boolean;
  validating: boolean;
  users: User[];
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useUsers(params?: FindManyUsersParamsDto): UsersHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isValidating, data, error, mutate } = useSWR<User[]>(
    params ? `${ApiEndpoints.USERS}?${query}` : ApiEndpoints.USERS
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: typeof data === 'undefined' && !error,
    validating: isValidating,
    users: data ?? [],
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useUsers;
