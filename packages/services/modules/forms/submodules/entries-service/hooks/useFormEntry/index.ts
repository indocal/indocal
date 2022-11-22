import { useCallback } from 'react';
import useSWR from 'swr';

import {
  ServiceError,
  createServiceError,
  UUID,
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
  const { isValidating, data, error, mutate } = useSWR<FormEntry>(
    `${ApiEndpoints.FORMS_ENTRIES}/${id}`
  );

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: typeof data === 'undefined' && !error,
    validating: isValidating,
    entry: data ?? null,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useFormEntry;
