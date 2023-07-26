import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import {
  ServiceCertificate,
  FindManyServicesCertificatesParamsDto,
} from '../../types';

export interface ServicesCertificatesHookReturn {
  loading: boolean;
  validating: boolean;
  certificates: ServiceCertificate[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useServicesCertificates(
  params?: FindManyServicesCertificatesParamsDto
): ServicesCertificatesHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<ServiceCertificate>
  >(
    params
      ? `${ApiEndpoints.SERVICES_CERTIFICATES}?${query}`
      : ApiEndpoints.SERVICES_CERTIFICATES
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    certificates: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useServicesCertificates;
