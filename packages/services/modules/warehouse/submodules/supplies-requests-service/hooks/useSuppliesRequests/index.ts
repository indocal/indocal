import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { SupplyRequest, FindManySuppliesRequestsParamsDto } from '../../types';

export interface SuppliesRequestsHookReturn {
  loading: boolean;
  validating: boolean;
  requests: SupplyRequest[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useSuppliesRequests(
  params?: FindManySuppliesRequestsParamsDto
): SuppliesRequestsHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<SupplyRequest>
  >(
    params
      ? `${ApiEndpoints.SUPPLIES_REQUESTS}?${query}`
      : ApiEndpoints.SUPPLIES_REQUESTS
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    requests: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useSuppliesRequests;
