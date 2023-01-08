import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { FormEntry, FindManyFormsEntriesParamsDto } from '../../types';

export interface FormsEntriesHookReturn {
  loading: boolean;
  validating: boolean;
  entries: FormEntry[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useFormsEntries(
  params?: FindManyFormsEntriesParamsDto
): FormsEntriesHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<FormEntry>
  >(
    params
      ? `${ApiEndpoints.FORMS_ENTRIES}?${query}`
      : ApiEndpoints.FORMS_ENTRIES
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    entries: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useFormsEntries;
