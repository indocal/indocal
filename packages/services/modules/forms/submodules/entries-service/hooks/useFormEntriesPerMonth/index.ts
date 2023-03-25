import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  UUID,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import {
  FormEntriesPerMonth,
  CalcFormEntriesPerMonthParamsDto,
} from '../../types';

export interface FormEntriesPerMonthHookReturn {
  loading: boolean;
  validating: boolean;
  entriesPerMonth: FormEntriesPerMonth[];
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useFormEntriesPerMonth(
  id: UUID,
  params: CalcFormEntriesPerMonthParamsDto
): FormEntriesPerMonthHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    FormEntriesPerMonth[]
  >(`${ApiEndpoints.FORMS_ENTRIES_STATS}/${id}/entries-per-month?${query}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    entriesPerMonth: data ?? [],
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useFormEntriesPerMonth;
