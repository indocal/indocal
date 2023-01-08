import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { Supply } from '../../types';

export interface SupplyHookReturn {
  loading: boolean;
  validating: boolean;
  supply: Supply | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useSupply(id: UUID): SupplyHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<Supply>
  >(`${ApiEndpoints.SUPPLIES}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    supply: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useSupply;
