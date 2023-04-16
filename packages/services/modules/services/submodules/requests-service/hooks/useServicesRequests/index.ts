import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { ServiceRequest, FindManyServicesRequestsParamsDto } from '../../types';

export interface ServicesRequestsHookReturn {
  loading: boolean;
  validating: boolean;
  requests: ServiceRequest[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useServicesRequests(
  params?: FindManyServicesRequestsParamsDto
): ServicesRequestsHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<ServiceRequest>
  >(
    params
      ? `${ApiEndpoints.SERVICES_REQUESTS}?${query}`
      : ApiEndpoints.SERVICES_REQUESTS
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

export default useServicesRequests;
