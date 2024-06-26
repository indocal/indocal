import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { UserRole } from '../../types';

export interface UserRoleHookReturn {
  loading: boolean;
  validating: boolean;
  role: UserRole | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useUserRole(id: UUID): UserRoleHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<UserRole>
  >(`${ApiEndpoints.USERS_ROLES}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    role: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useUserRole;
