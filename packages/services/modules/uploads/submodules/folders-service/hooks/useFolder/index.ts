import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { Folder } from '../../types';

export interface FolderHookReturn {
  loading: boolean;
  validating: boolean;
  folder: Folder | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useFolder(id: UUID): FolderHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<Folder>
  >(`${ApiEndpoints.FOLDERS}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    folder: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useFolder;
