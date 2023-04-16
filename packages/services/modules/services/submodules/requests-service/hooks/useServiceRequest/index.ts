import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { ServiceRequest } from '../../types';

export interface ServiceRequestHookReturn {
  loading: boolean;
  validating: boolean;
  request: ServiceRequest | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useServiceRequest(id: UUID): ServiceRequestHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<ServiceRequest>
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

export default useServiceRequest;
