import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import { ServiceError, createServiceError } from '../../../../common';
import { ApiEndpoints } from '../../../../config';

import { Log, FindManyLogsParamsDto } from '../../types';

export interface LogsHookReturn {
  loading: boolean;
  validating: boolean;
  logs: Log[];
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useLogs(params?: FindManyLogsParamsDto): LogsHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isValidating, data, error, mutate } = useSWR<Log[]>(
    params ? `${ApiEndpoints.LOGS}?${query}` : ApiEndpoints.LOGS
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: typeof data === 'undefined' && !error,
    validating: isValidating,
    logs: data ?? [],
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useLogs;
