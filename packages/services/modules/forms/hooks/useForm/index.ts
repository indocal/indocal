import { useCallback } from 'react';
import useSWR from 'swr';

import { ServiceError, createServiceError, UUID } from '../../../../common';
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
  const { isValidating, data, error, mutate } = useSWR<Form>(
    `${ApiEndpoints.FORMS}/${id}`
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: typeof data === 'undefined' && !error,
    validating: isValidating,
    form: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useForm;
