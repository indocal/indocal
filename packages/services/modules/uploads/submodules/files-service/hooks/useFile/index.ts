import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { File } from '../../types';

export interface FileHookReturn {
  loading: boolean;
  validating: boolean;
  file: File | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useFile(id: UUID): FileHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<File>
  >(`${ApiEndpoints.FILES}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    file: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useFile;
