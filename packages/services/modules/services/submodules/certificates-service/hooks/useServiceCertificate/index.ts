import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { ServiceCertificate } from '../../types';

export interface ServiceCertificateHookReturn {
  loading: boolean;
  validating: boolean;
  certificate: ServiceCertificate | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useServiceCertificate(id: UUID): ServiceCertificateHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<ServiceCertificate>
  >(`${ApiEndpoints.SERVICES_CERTIFICATES}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    certificate: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useServiceCertificate;
