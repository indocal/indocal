import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import { ServiceError, createServiceError, UUID } from '../../../../common';
import { ApiEndpoints } from '../../../../config';

import {
  ServiceRequestsPerMonth,
  CalcServiceRequestsPerMonthParamsDto,
} from '../../types';

export interface ServiceRequestsPerMonthHookReturn {
  loading: boolean;
  validating: boolean;
  requestsPerMonth: ServiceRequestsPerMonth[];
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useServiceRequestsPerMonth(
  id: UUID,
  params: CalcServiceRequestsPerMonthParamsDto
): ServiceRequestsPerMonthHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    ServiceRequestsPerMonth[]
  >(`${ApiEndpoints.SERVICES}/${id}/stats/requests-per-month?${query}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    requestsPerMonth: data ?? [],
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useServiceRequestsPerMonth;
