import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { Supplier } from '../../types';

export interface SupplierHookReturn {
  loading: boolean;
  validating: boolean;
  supplier: Supplier | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useSupplier(id: UUID): SupplierHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<Supplier>
  >(`${ApiEndpoints.SUPPLIERS}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    supplier: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useSupplier;
