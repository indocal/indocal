import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import { ServiceError, createServiceError } from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { CountApiTokensParamsDto } from '../../types';

export interface ApiTokensCountHookReturn {
  loading: boolean;
  validating: boolean;
  count: number | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useApiTokensCount(
  params?: CountApiTokensParamsDto
): ApiTokensCountHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<number>(
    params
      ? `${ApiEndpoints.API_TOKENS_COUNT}?${query}`
      : ApiEndpoints.API_TOKENS_COUNT
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    count: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useApiTokensCount;
