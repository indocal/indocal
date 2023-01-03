import { useCallback } from 'react';
import useSWR from 'swr';

import { ServiceError, createServiceError, UUID } from '../../../../common';
import { ApiEndpoints } from '../../../../config';

import { Log } from '../../types';

export interface LogHookReturn {
  loading: boolean;
  validating: boolean;
  log: Log | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useLog(id: UUID): LogHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<Log>(
    `${ApiEndpoints.LOGS}/${id}`
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    log: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useLog;
