import { useState, useCallback } from 'react';

import { useAbility, useUsers } from '@indocal/services';

import { GenericUsersDataGrid } from '@/features';

import { UsersDataGridProvider, useUsersDataGrid } from './context';
import { AddUserDialog } from './components';

const UsersDataGrid: React.FC = () => {
  const ability = useAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    users,
    count,
    error: serviceError,
    refetch,
  } = useUsers({
    ...(search && {
      filters: {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { username: { mode: 'insensitive', contains: search } },
          { email: { mode: 'insensitive', contains: search } },
          { name: { mode: 'insensitive', contains: search } },
        ],
      },
    }),
    orderBy: { username: 'asc' },
  });

  const { isAddUserDialogOpen, toggleAddUserDialog } = useUsersDataGrid();

  const handleAdd = useCallback(
    () => toggleAddUserDialog(),
    [toggleAddUserDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddUserDialogOpen && <AddUserDialog />}

      <GenericUsersDataGrid
        title={`Usuarios (${count})`}
        users={users}
        onAddButtonClick={ability.can('create', 'user') && handleAdd}
        onRefreshButtonClick={ability.can('read', 'user') && handleRefetch}
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
          page: pagination.page,
          pageSize: pagination.pageSize,
          onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
          onPageSizeChange: (pageSize) =>
            setPagination((prev) => ({ ...prev, pageSize })),
        }}
      />
    </>
  );
};

const UsersDataGridWrapper: React.FC = () => (
  <UsersDataGridProvider>
    <UsersDataGrid />
  </UsersDataGridProvider>
);

export { UsersDataGridWrapper as UsersDataGrid };

export default UsersDataGridWrapper;
