import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { Order } from '../../types';

export interface OrderHookReturn {
  loading: boolean;
  validating: boolean;
  order: Order | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useOrder(id: UUID): OrderHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<Order>(
    `${ApiEndpoints.ORDERS}/${id}`
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    order: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useOrder;
