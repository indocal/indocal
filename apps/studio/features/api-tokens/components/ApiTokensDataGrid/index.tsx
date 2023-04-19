import { useState, useCallback } from 'react';

import { useAppAbility, useApiTokens } from '@indocal/services';

import { GenericApiTokensDataGrid } from '@/features';

import { ApiTokensDataGridProvider, useApiTokensDataGrid } from './context';
import { AddApiTokenDialog } from './components';

const ApiTokensDataGrid: React.FC = () => {
  const ability = useAppAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    apiTokens,
    count,
    error: serviceError,
    refetch,
  } = useApiTokens({
    ...(search && {
      filters: {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { name: { mode: 'insensitive', contains: search } },
          { description: { mode: 'insensitive', contains: search } },
        ],
      },
    }),
    pagination: {
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
    },
    orderBy: { name: 'asc' },
  });

  const { isAddApiTokenDialogOpen, toggleAddApiTokenDialog } =
    useApiTokensDataGrid();

  const handleAdd = useCallback(
    () => toggleAddApiTokenDialog(),
    [toggleAddApiTokenDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddApiTokenDialogOpen && <AddApiTokenDialog />}

      <GenericApiTokensDataGrid
        title={`API Tokens (${count})`}
        apiTokens={apiTokens}
        onAddButtonClick={ability.can('create', 'apiToken') && handleAdd}
        onRefreshButtonClick={ability.can('read', 'apiToken') && handleRefetch}
        enhancedDataGridProps={{
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
    </>
  );
};

const ApiTokensDataGridWrapper: React.FC = () => (
  <ApiTokensDataGridProvider>
    <ApiTokensDataGrid />
  </ApiTokensDataGridProvider>
);

export { ApiTokensDataGridWrapper as ApiTokensDataGrid };

export default ApiTokensDataGridWrapper;
