import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../common';
import { ApiEndpoints } from '../../../../config';

import { Service, FindManyServicesParamsDto } from '../../types';

export interface ServicesHookReturn {
  loading: boolean;
  validating: boolean;
  services: Service[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useServices(
  params?: FindManyServicesParamsDto
): ServicesHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<Service>
  >(params ? `${ApiEndpoints.SERVICES}?${query}` : ApiEndpoints.SERVICES);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    services: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useServices;
