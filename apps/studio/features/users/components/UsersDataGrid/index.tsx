import { useCallback } from 'react';

import { useUsers } from '@indocal/services';

import { GenericUsersDataGrid } from '@/features';

import { UsersDataGridProvider, useUsersDataGrid } from './context';
import { AddUserDialog } from './components';

const UsersDataGrid: React.FC = () => {
  const {
    loading,
    validating,
    users,
    error: serviceError,
    refetch,
  } = useUsers({ orderBy: { username: 'asc' } });

  const { isAddUserDialogOpen, toggleAddUserDialog } = useUsersDataGrid();

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddUserDialogOpen && <AddUserDialog />}

      <GenericUsersDataGrid
        title={`Usuarios (${users.length})`}
        users={users}
        onAddButtonClick={toggleAddUserDialog}
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

const UsersDataGridWrapper: React.FC = () => (
  <UsersDataGridProvider>
    <UsersDataGrid />
  </UsersDataGridProvider>
);

export { UsersDataGridWrapper as UsersDataGrid };

export default UsersDataGridWrapper;
