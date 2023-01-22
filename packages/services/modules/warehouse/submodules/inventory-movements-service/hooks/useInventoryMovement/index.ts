import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { InventoryMovement } from '../../types';

export interface InventoryMovementHookReturn {
  loading: boolean;
  validating: boolean;
  movement: InventoryMovement | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useInventoryMovement(id: UUID): InventoryMovementHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<InventoryMovement>
  >(`${ApiEndpoints.INVENTORY_MOVEMENTS}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    movement: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useInventoryMovement;
