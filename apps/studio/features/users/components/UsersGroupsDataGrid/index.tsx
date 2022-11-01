import { useCallback } from 'react';

import { useUsersGroups } from '@indocal/services';

import { GenericUsersGroupsDataGrid } from '@/features';

import { UsersGroupsDataGridProvider, useUsersGroupsDataGrid } from './context';
import { AddUserGroupDialog } from './components';

const UsersGroupsDataGrid: React.FC = () => {
  const {
    loading,
    validating,
    groups,
    error: serviceError,
    refetch,
  } = useUsersGroups({ orderBy: { name: 'asc' } });

  const { isAddUserGroupDialogOpen, toggleAddUserGroupDialog } =
    useUsersGroupsDataGrid();

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddUserGroupDialogOpen && <AddUserGroupDialog />}

      <GenericUsersGroupsDataGrid
        title={`Grupos (${groups.length})`}
        groups={groups}
        onAddButtonClick={toggleAddUserGroupDialog}
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

const UsersGroupsDataGridWrapper: React.FC = () => (
  <UsersGroupsDataGridProvider>
    <UsersGroupsDataGrid />
  </UsersGroupsDataGridProvider>
);

export { UsersGroupsDataGridWrapper as UsersGroupsDataGrid };

export default UsersGroupsDataGridWrapper;
