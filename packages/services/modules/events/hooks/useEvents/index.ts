import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import qs from 'qs';

import {
  ServiceError,
  createServiceError,
  MultipleEntitiesResponse,
} from '../../../../common';
import { ApiEndpoints } from '../../../../config';

import { Event, FindManyEventsParamsDto } from '../../types';

export interface EventsHookReturn {
  loading: boolean;
  validating: boolean;
  events: Event[];
  count: number;
  error: ServiceError | null;
  refetch: () => Promise<void>;
}

export function useEvents(params?: FindManyEventsParamsDto): EventsHookReturn {
  const query = useMemo(() => qs.stringify(params), [params]);

  const { isLoading, isValidating, data, error, mutate } = useSWR<
    MultipleEntitiesResponse<Event>
  >(params ? `${ApiEndpoints.EVENTS}?${query}` : ApiEndpoints.EVENTS);

  const handleRefetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    loading: isLoading,
    validating: isValidating,
    events: data?.entities ?? [],
    count: data?.count ?? 0,
    error: error ? createServiceError(error) : null,
    refetch: handleRefetch,
  };
}

export default useEvents;
