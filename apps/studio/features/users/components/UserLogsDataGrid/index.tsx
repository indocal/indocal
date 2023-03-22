import { useState, useCallback } from 'react';

import { useAbility, useLogs, User } from '@indocal/services';

import { GenericLogsDataGrid } from '@/features';

export interface UserLogsDataGridProps {
  user: User;
}

export const UserLogsDataGrid: React.FC<UserLogsDataGridProps> = ({ user }) => {
  const ability = useAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    logs,
    count,
    error: serviceError,
    refetch,
  } = useLogs({
    filters: {
      user: { id: user.id },
      ...(search && {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { context: { mode: 'insensitive', contains: search } },
          { action: { mode: 'insensitive', contains: search } },
        ],
      }),
    },
    pagination: {
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
    },
    orderBy: { createdAt: 'desc' },
  });

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <GenericLogsDataGrid
      title={`Registros del usuario (${count})`}
      logs={logs}
      onRefreshButtonClick={ability.can('read', 'log') && handleRefetch}
      enhancedDataGridProps={{
        density: 'compact',
        loading: loading || validating,
        error: serviceError,

        quickFilterProps: { placeholder: 'Buscar...' },
        filterMode: 'server',
        onFilterModelChange: ({ quickFilterValues }) =>
          setSearch((prev) =>
            quickFilterValues ? quickFilterValues.join(' ') : prev
          ),

        paginationMode: 'server',
        rowCount: count,
        paginationModel: {
          page: pagination.page,
          pageSize: pagination.pageSize,
        },
        onPaginationModelChange: ({ page, pageSize }) => {
          setPagination((prev) => ({ ...prev, page }));
          setPagination((prev) => ({ ...prev, pageSize }));
        },
      }}
    />
  );
};

export default UserLogsDataGrid;
