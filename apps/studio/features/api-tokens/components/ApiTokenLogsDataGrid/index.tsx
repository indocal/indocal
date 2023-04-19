import { useState, useCallback } from 'react';

import { useAppAbility, useLogs, ApiToken } from '@indocal/services';

import { GenericLogsDataGrid } from '@/features';

export interface ApiTokenLogsDataGridProps {
  apiToken: ApiToken;
}

export const ApiTokenLogsDataGrid: React.FC<ApiTokenLogsDataGridProps> = ({
  apiToken,
}) => {
  const ability = useAppAbility();

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
      apiToken: { id: apiToken.id },
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
      title={`Registros del API Token (${count})`}
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

export default ApiTokenLogsDataGrid;
