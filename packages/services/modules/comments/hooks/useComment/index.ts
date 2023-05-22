import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../common';
import { ApiEndpoints } from '../../../../config';

import { Comment } from '../../types';

export interface CommentHookReturn {
  loading: boolean;
  validating: boolean;
  comment: Comment | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useComment(id: UUID): CommentHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<Comment>
  >(`${ApiEndpoints.COMMENTS}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    comment: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useComment;
