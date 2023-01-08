import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { Supplier, FindManySuppliersParamsDto } from '../../types';

export interface SuppliersHookReturn {
  loading: boolean;
  validating: boolean;
  suppliers: Supplier[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useSuppliers(
  params?: FindManySuppliersParamsDto
): SuppliersHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<Supplier>
  >(params ? `${ApiEndpoints.SUPPLIERS}?${query}` : ApiEndpoints.SUPPLIERS);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    suppliers: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useSuppliers;
