import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { WarehouseSupplier } from '../../types';

export interface WarehouseSupplierHookReturn {
  loading: boolean;
  validating: boolean;
  supplier: WarehouseSupplier | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useWarehouseSupplier(id: UUID): WarehouseSupplierHookReturn {
  const { isValidating, data, error, mutate } = useSWR<WarehouseSupplier>(
    `${ApiEndpoints.WAREHOUSE_SUPPLIERS}/${id}`
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: typeof data === 'undefined' && !error,
    validating: isValidating,
    supplier: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useWarehouseSupplier;
