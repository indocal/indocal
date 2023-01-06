import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import { ServiceError, createServiceError } from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { CountOrdersParamsDto } from '../../types';

export interface OrdersCountHookReturn {
  loading: boolean;
  validating: boolean;
  count: number | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useOrdersCount(
  params?: CountOrdersParamsDto
): OrdersCountHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<number>(
    params ? `${ApiEndpoints.ORDERS_COUNT}?${query}` : ApiEndpoints.ORDERS
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    count: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useOrdersCount;
