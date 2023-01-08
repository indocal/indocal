import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { UserGroup } from '../../types';

export interface UserGroupHookReturn {
  loading: boolean;
  validating: boolean;
  group: UserGroup | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useUserGroup(id: UUID): UserGroupHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<UserGroup>
  >(`${ApiEndpoints.USERS_GROUPS}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    group: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useUserGroup;
