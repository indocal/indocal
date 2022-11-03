import { useCallback } from 'react';

import { useUsersRoles } from '@indocal/services';

import { GenericUsersRolesDataGrid } from '@/features';

import { UsersRolesDataGridProvider, useUsersRolesDataGrid } from './context';
import { AddUserRoleDialog } from './components';

const UsersRolesDataGrid: React.FC = () => {
  const {
    loading,
    validating,
    roles,
    error: serviceError,
    refetch,
  } = useUsersRoles({ orderBy: { name: 'asc' } });

  const { isAddUserRoleDialogOpen, toggleAddUserRoleDialog } =
    useUsersRolesDataGrid();

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddUserRoleDialogOpen && <AddUserRoleDialog />}

      <GenericUsersRolesDataGrid
        title={`Roles (${roles.length})`}
        roles={roles}
        onAddButtonClick={toggleAddUserRoleDialog}
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

const UsersRolesDataGridWrapper: React.FC = () => (
  <UsersRolesDataGridProvider>
    <UsersRolesDataGrid />
  </UsersRolesDataGridProvider>
);

export { UsersRolesDataGridWrapper as UsersRolesDataGrid };

export default UsersRolesDataGridWrapper;
