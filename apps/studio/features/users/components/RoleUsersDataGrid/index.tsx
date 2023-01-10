import { useState, useCallback } from 'react';

import { useAbility, useUsers, UserRole } from '@indocal/services';

import { GenericUsersDataGrid } from '@/features';

import { RoleUsersDataGridProvider, useRoleUsersDataGrid } from './context';
import { ManageRoleUsersDialog } from './components';

export interface RoleUsersDataGridProps {
  role: UserRole;
}

const RoleUsersDataGrid: React.FC<RoleUsersDataGridProps> = ({ role }) => {
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
    filters: {
      roles: { some: { id: role.id } },
      ...(search && {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { username: { mode: 'insensitive', contains: search } },
          { email: { mode: 'insensitive', contains: search } },
          { name: { mode: 'insensitive', contains: search } },
        ],
      }),
    },
    orderBy: { username: 'asc' },
  });

  const { isManageRoleUsersDialogOpen, toggleManageRoleUsersDialog } =
    useRoleUsersDataGrid();

  const handleAdd = useCallback(
    () => toggleManageRoleUsersDialog(),
    [toggleManageRoleUsersDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isManageRoleUsersDialogOpen && <ManageRoleUsersDialog role={role} />}

      <GenericUsersDataGrid
        title={`Miembros del rol (${count})`}
        users={users}
        onAddButtonClick={
          ability.can('update', 'userRole') &&
          ability.can('read', 'user') &&
          handleAdd
        }
        onRefreshButtonClick={ability.can('read', 'user') && handleRefetch}
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

const RoleUsersDataGridWrapper: React.FC<RoleUsersDataGridProps> = (props) => (
  <RoleUsersDataGridProvider>
    <RoleUsersDataGrid {...props} />
  </RoleUsersDataGridProvider>
);

export { RoleUsersDataGridWrapper as RoleUsersDataGrid };

export default RoleUsersDataGridWrapper;
