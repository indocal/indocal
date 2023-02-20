import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { File, FindManyFilesParamsDto } from '../../types';

export interface FilesHookReturn {
  loading: boolean;
  validating: boolean;
  files: File[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useFiles(params?: FindManyFilesParamsDto): FilesHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<File>
  >(params ? `${ApiEndpoints.FILES}?${query}` : ApiEndpoints.FILES);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    files: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useFiles;
