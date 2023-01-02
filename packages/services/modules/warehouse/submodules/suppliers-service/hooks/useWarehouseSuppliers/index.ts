import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import { ServiceError, createServiceError } from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import {
  WarehouseSupplier,
  FindManyWarehouseSuppliersParamsDto,
} from '../../types';

export interface WarehouseSuppliersHookReturn {
  loading: boolean;
  validating: boolean;
  suppliers: WarehouseSupplier[];
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useWarehouseSuppliers(
  params?: FindManyWarehouseSuppliersParamsDto
): WarehouseSuppliersHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isValidating, data, error, mutate } = useSWR<WarehouseSupplier[]>(
    params
      ? `${ApiEndpoints.WAREHOUSE_SUPPLIERS}?${query}`
      : ApiEndpoints.WAREHOUSE_SUPPLIERS
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: typeof data === 'undefined' && !error,
    validating: isValidating,
    suppliers: data ?? [],
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useWarehouseSuppliers;
