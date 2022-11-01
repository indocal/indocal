import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import { ServiceError, createServiceError } from '../../../../common';
import { ApiEndpoints } from '../../../../config';

import { Form, FindManyFormsParamsDto } from '../../types';

export interface FormsHookReturn {
  loading: boolean;
  validating: boolean;
  forms: Form[];
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useForms(params?: FindManyFormsParamsDto): FormsHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isValidating, data, error, mutate } = useSWR<Form[]>(
    params ? `${ApiEndpoints.FORMS}?${query}` : ApiEndpoints.FORMS
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: typeof data === 'undefined' && !error,
    validating: isValidating,
    forms: data ?? [],
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useForms;
