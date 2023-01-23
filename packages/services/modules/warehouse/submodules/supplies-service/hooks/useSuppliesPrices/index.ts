import { useCallback } from 'react';
import useSWR from 'swr';

import { ServiceError, createServiceError } from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { SupplyPrices } from '../../types';

export interface SuppliesPricesHookReturn {
  loading: boolean;
  validating: boolean;
  suppliesPrices: SupplyPrices[];
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useSuppliesPrices(): SuppliesPricesHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SupplyPrices[]
  >(`${ApiEndpoints.SUPPLIES}/stats/prices`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    suppliesPrices: data ?? [],
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useSuppliesPrices;
