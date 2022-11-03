import { useCallback } from 'react';

import { useUsers, UserRole } from '@indocal/services';

import { GenericUsersDataGrid } from '@/features';

import { RoleUsersDataGridProvider, useRoleUsersDataGrid } from './context';
import { ManageRoleUsersDialog } from './components';

export interface RoleUsersDataGridProps {
  role: UserRole;
}

const RoleUsersDataGrid: React.FC<RoleUsersDataGridProps> = ({ role }) => {
  const {
    loading,
    validating,
    users,
    error: serviceError,
    refetch,
  } = useUsers({
    filters: { roles: { some: { id: role.id } } },
    orderBy: { username: 'asc' },
  });

  const { isManageRoleUsersDialogOpen, toggleManageRoleUsersDialog } =
    useRoleUsersDataGrid();

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isManageRoleUsersDialogOpen && <ManageRoleUsersDialog role={role} />}

      <GenericUsersDataGrid
        title={`Miembros del rol (${users.length})`}
        users={users}
        onAddButtonClick={toggleManageRoleUsersDialog}
        onRefreshButtonClick={handleRefetch}
        enhancedDataGridProps={{
          loading: loading || validating,
          error: serviceError,
          quickFilterProps: { placeholder: 'Buscar...' },
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
