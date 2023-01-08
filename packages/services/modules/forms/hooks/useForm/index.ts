import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../common';
import { ApiEndpoints } from '../../../../config';

import { Form } from '../../types';

export interface FormHookReturn {
  loading: boolean;
  validating: boolean;
  form: Form | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useForm(id: UUID): FormHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<Form>
  >(`${ApiEndpoints.FORMS}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    form: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useForm;
