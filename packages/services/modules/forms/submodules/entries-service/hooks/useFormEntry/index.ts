import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
} from '../../../../../../common';
import { ApiEndpoints } from '../../../../../../config';

import { FormEntry } from '../../types';

export interface FormEntryHookReturn {
  loading: boolean;
  validating: boolean;
  entry: FormEntry | null;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useFormEntry(id: UUID): FormEntryHookReturn {
  const { isLoading, isValidating, data, error, mutate } = useSWR<
    SingleEntityResponse<FormEntry>
  >(`${ApiEndpoints.FORMS_ENTRIES}/${id}`);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    entry: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useFormEntry;
