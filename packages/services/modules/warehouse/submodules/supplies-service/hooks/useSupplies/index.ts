import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { Supply, FindManySuppliesParamsDto } from '../../types';

export interface SuppliesHookReturn {
  loading: boolean;
  validating: boolean;
  supplies: Supply[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useSupplies(
  params?: FindManySuppliesParamsDto
): SuppliesHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<Supply>
  >(params ? `${ApiEndpoints.SUPPLIES}?${query}` : ApiEndpoints.SUPPLIES);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    supplies: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useSupplies;
