import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { SupplyPrices } from '../../types';

export interface SupplyPricesHookReturn {
  loading: boolean;
  validating: boolean;
  supplyPrices: SupplyPrices | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useSupplyPrices(id: UUID): SupplyPricesHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<SupplyPrices>(
    `${ApiEndpoints.SUPPLIES}/${id}/stats/prices`
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    supplyPrices: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useSupplyPrices;
