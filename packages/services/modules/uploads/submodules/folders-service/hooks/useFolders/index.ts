import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { Folder, FindManyFoldersParamsDto } from '../../types';

export interface FoldersHookReturn {
  loading: boolean;
  validating: boolean;
  folders: Folder[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useFolders(
  params?: FindManyFoldersParamsDto
): FoldersHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<Folder>
  >(params ? `${ApiEndpoints.FOLDERS}?${query}` : ApiEndpoints.FOLDERS);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    folders: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useFolders;
