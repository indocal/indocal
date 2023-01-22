import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import {
  InventoryMovement,
  FindManyInventoryMovementsParamsDto,
} from '../../types';

export interface InventoryMovementsHookReturn {
  loading: boolean;
  validating: boolean;
  movements: InventoryMovement[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useInventoryMovements(
  params?: FindManyInventoryMovementsParamsDto
): InventoryMovementsHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<InventoryMovement>
  >(
    params
      ? `${ApiEndpoints.INVENTORY_MOVEMENTS}?${query}`
      : ApiEndpoints.INVENTORY_MOVEMENTS
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    movements: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useInventoryMovements;
