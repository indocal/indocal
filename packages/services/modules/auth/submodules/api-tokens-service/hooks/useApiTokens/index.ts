import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { ApiToken, FindManyApiTokensParamsDto } from '../../types';

export interface ApiTokensHookReturn {
  loading: boolean;
  validating: boolean;
  apiTokens: ApiToken[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useApiTokens(
  params?: FindManyApiTokensParamsDto
): ApiTokensHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<ApiToken>
  >(params ? `${ApiEndpoints.API_TOKENS}?${query}` : ApiEndpoints.API_TOKENS);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    apiTokens: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useApiTokens;
