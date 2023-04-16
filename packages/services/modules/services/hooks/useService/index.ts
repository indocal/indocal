import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../common';
import { ApiEndpoints } from '../../../../config';

import { Service } from '../../types';

export interface ServiceHookReturn {
  loading: boolean;
  validating: boolean;
  service: Service | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useService(id: UUID): ServiceHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<Service>
  >(`${ApiEndpoints.SERVICES}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    service: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useService;
