import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import { ServiceError, createServiceError } from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { Supply, FindManySuppliesParamsDto } from '../../types';

export interface SuppliesHookReturn {
  loading: boolean;
  validating: boolean;
  supplies: Supply[];
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useSupplies(
  params?: FindManySuppliesParamsDto
): SuppliesHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isValidating, data, error, mutate } = useSWR<Supply[]>(
    params ? `${ApiEndpoints.SUPPLIES}?${query}` : ApiEndpoints.SUPPLIES
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: typeof data === 'undefined' && !error,
    validating: isValidating,
    supplies: data ?? [],
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useSupplies;
