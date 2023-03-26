import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  UUID,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { FormFieldReport, CalcFormFieldsReportsParamsDto } from '../../types';

export interface FormFieldsReportsHookReturn {
  loading: boolean;
  validating: boolean;
  reports: FormFieldReport[];
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useFormFieldsReports(
  id: UUID,
  params: CalcFormFieldsReportsParamsDto
): FormFieldsReportsHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    FormFieldReport[]
  >(`${ApiEndpoints.FORMS_ENTRIES_STATS}/${id}/fields-reports?${query}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    reports: data ?? [],
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useFormFieldsReports;
