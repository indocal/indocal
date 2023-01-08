import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../common';
import { ApiEndpoints } from '../../../../config';

import { Log, FindManyLogsParamsDto } from '../../types';

export interface LogsHookReturn {
  loading: boolean;
  validating: boolean;
  logs: Log[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useLogs(params?: FindManyLogsParamsDto): LogsHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<Log>
  >(params ? `${ApiEndpoints.LOGS}?${query}` : ApiEndpoints.LOGS);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    logs: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useLogs;
