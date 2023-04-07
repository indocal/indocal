import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { ApiToken } from '../../types';

export interface ApiTokenHookReturn {
  loading: boolean;
  validating: boolean;
  apiToken: ApiToken | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useApiToken(id: UUID): ApiTokenHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<ApiToken>
  >(`${ApiEndpoints.API_TOKENS}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    apiToken: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useApiToken;
