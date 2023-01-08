import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../common';
import { ApiEndpoints } from '../../../../config';

import { Form, FindManyFormsParamsDto } from '../../types';

export interface FormsHookReturn {
  loading: boolean;
  validating: boolean;
  forms: Form[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useForms(params?: FindManyFormsParamsDto): FormsHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<Form>
  >(params ? `${ApiEndpoints.FORMS}?${query}` : ApiEndpoints.FORMS);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    forms: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useForms;
