import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import { ServiceError, createServiceError } from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { FormEntry, FindManyFormsEntriesParamsDto } from '../../types';

export interface FormsEntriessHookReturn {
  loading: boolean;
  validating: boolean;
  entries: FormEntry[];
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useFormsEntriess(
  params?: FindManyFormsEntriesParamsDto
): FormsEntriessHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isValidating, data, error, mutate } = useSWR<FormEntry[]>(
    params
      ? `${ApiEndpoints.FORMS_ENTRIES}?${query}`
      : ApiEndpoints.FORMS_ENTRIES
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: typeof data === 'undefined' && !error,
    validating: isValidating,
    entries: data ?? [],
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useFormsEntriess;
