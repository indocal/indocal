import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../common';
import { ApiEndpoints } from '../../../../config';

import { Event } from '../../types';

export interface EventHookReturn {
  loading: boolean;
  validating: boolean;
  event: Event | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useEvent(id: UUID): EventHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<Event>
  >(`${ApiEndpoints.EVENTS}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    event: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useEvent;
