import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../common';
import { ApiEndpoints } from '../../../../config';

import { Comment, FindManyCommentsParamsDto } from '../../types';

export interface CommentsHookReturn {
  loading: boolean;
  validating: boolean;
  comments: Comment[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useComments(
  params?: FindManyCommentsParamsDto
): CommentsHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<Comment>
  >(params ? `${ApiEndpoints.COMMENTS}?${query}` : ApiEndpoints.COMMENTS);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    comments: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useComments;
