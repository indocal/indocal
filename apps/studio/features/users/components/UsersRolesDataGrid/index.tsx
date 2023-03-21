import { useState, useCallback } from 'react';

import { useAbility, useUsersRoles } from '@indocal/services';

import { GenericUsersRolesDataGrid } from '@/features';

import { UsersRolesDataGridProvider, useUsersRolesDataGrid } from './context';
import { AddUserRoleDialog } from './components';

const UsersRolesDataGrid: React.FC = () => {
  const ability = useAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    roles,
    count,

    refetch,
  } = useUsersRoles({
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

  const { isAddUserRoleDialogOpen, toggleAddUserRoleDialog } =
    useUsersRolesDataGrid();

  const handleAdd = useCallback(
    () => toggleAddUserRoleDialog(),
    [toggleAddUserRoleDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddUserRoleDialogOpen && <AddUserRoleDialog />}

      <GenericUsersRolesDataGrid
        title={`Roles (${count})`}
        roles={roles}
        onAddButtonClick={ability.can('create', 'userRole') && handleAdd}
        onRefreshButtonClick={ability.can('read', 'userRole') && handleRefetch}
        enhancedDataGridProps={{
          loading: loading || validating,

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

const UsersRolesDataGridWrapper: React.FC = () => (
  <UsersRolesDataGridProvider>
    <UsersRolesDataGrid />
  </UsersRolesDataGridProvider>
);

export { UsersRolesDataGridWrapper as UsersRolesDataGrid };

export default UsersRolesDataGridWrapper;
