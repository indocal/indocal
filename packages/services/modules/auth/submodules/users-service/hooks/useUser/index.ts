import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { User } from '../../types';

export interface UserHookReturn {
  loading: boolean;
  validating: boolean;
  user: User | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useUser(id: UUID): UserHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<User>
  >(`${ApiEndpoints.USERS}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    user: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useUser;
