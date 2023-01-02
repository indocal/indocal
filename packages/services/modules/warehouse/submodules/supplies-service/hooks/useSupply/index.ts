import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
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
  const { isValidating, data, error, mutate } = useSWR<Supply>(
    `${ApiEndpoints.SUPPLIES}/${id}`
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: typeof data === 'undefined' && !error,
    validating: isValidating,
    supply: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useSupply;
