import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { SupplyRequest } from '../../types';

export interface SupplyRequestHookReturn {
  loading: boolean;
  validating: boolean;
  request: SupplyRequest | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useSupplyRequest(id: UUID): SupplyRequestHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<SupplyRequest>
  >(`${ApiEndpoints.SUPPLIES_REQUESTS}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    request: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useSupplyRequest;
