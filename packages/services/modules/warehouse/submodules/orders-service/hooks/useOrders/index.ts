import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { Order, FindManyOrdersParamsDto } from '../../types';

export interface OrdersHookReturn {
  loading: boolean;
  validating: boolean;
  orders: Order[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useOrders(params?: FindManyOrdersParamsDto): OrdersHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<Order>
  >(params ? `${ApiEndpoints.ORDERS}?${query}` : ApiEndpoints.ORDERS);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    orders: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useOrders;
