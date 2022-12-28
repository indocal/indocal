import { useState, useMemo, useCallback } from 'react';

import {
  useAbility,
  useLogs,
  useLogsCount,
  FindManyLogsParamsDto,
  User,
} from '@indocal/services';

import { GenericLogsDataGrid } from '@/features';

export interface LogsDataGridProps {
  user?: User | null;
}

export const LogsDataGrid: React.FC<LogsDataGridProps> = ({ user }) => {
  const ability = useAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const params = useMemo<FindManyLogsParamsDto>(
    () => ({
      ...((user || search) && {
        filters: {
          ...(user && { user: { id: user.id } }),
          ...(search && {
            OR: [
              { context: { mode: 'insensitive', contains: search } },
              { action: { mode: 'insensitive', contains: search } },
              { user: { username: { mode: 'insensitive', contains: search } } },
              { user: { email: { mode: 'insensitive', contains: search } } },
            ],
          }),
        },
      }),
      pagination: {
        skip: pagination.page * pagination.pageSize,
        take: pagination.pageSize,
      },
      orderBy: { createdAt: 'desc' },
    }),
    [user, search, pagination.page, pagination.pageSize]
  );

  const {
    loading: loadingCount,
    validating: validatingCount,
    count,
    error: countError,
    refetch: refetchCount,
  } = useLogsCount(params);

  const {
    loading: loadingLogs,
    validating: validatingLogs,
    logs,
    error: logsError,
    refetch: refetchLogs,
  } = useLogs(params);

  const loading = useMemo(
    () => loadingCount || validatingCount || loadingLogs || validatingLogs,
    [loadingCount, validatingCount, loadingLogs, validatingLogs]
  );

  const error = useMemo(() => countError || logsError, [countError, logsError]);

  const handleRefetch = useCallback(async () => {
    await Promise.all([refetchLogs(), refetchCount()]);
  }, [refetchLogs, refetchCount]);

  return (
    <GenericLogsDataGrid
      title={
        user
          ? `Registros del usuario (${count ?? logs.length})`
          : `Registros (${count ?? logs.length})`
      }
      logs={logs}
      onRefreshButtonClick={ability.can('read', 'log') && handleRefetch}
      enhancedDataGridProps={{
        loading,
        error,

        quickFilterProps: { placeholder: 'Buscar...' },
        filterMode: 'server',
        onFilterModelChange: ({ quickFilterValues }) =>
          setSearch((prev) =>
            quickFilterValues ? quickFilterValues.join(' ') : prev
          ),

        paginationMode: 'server',
        rowCount: count ?? logs.length,
        page: pagination.page,
        pageSize: pagination.pageSize,
        onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
        onPageSizeChange: (pageSize) =>
          setPagination((prev) => ({ ...prev, pageSize })),
      }}
    />
  );
};

export default LogsDataGrid;
