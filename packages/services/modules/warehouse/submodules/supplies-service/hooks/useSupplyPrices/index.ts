import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { SupplyPrice } from '../../types';

export interface SupplyPricesHookReturn {
  loading: boolean;
  validating: boolean;
  prices: SupplyPrice[];
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useSupplyPrices(id: UUID): SupplyPricesHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SupplyPrice[]
  >(`${ApiEndpoints.SUPPLIES}/${id}/prices`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    prices: data ?? [],
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useSupplyPrices;
