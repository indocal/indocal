import { useCallback } from 'react';

import { useUsers, UserGroup } from '@indocal/services';

import { GenericUsersDataGrid } from '@/features';

import { GroupUsersDataGridProvider, useGroupUsersDataGrid } from './context';
import { ManageGroupUsersDialog } from './components';

export interface GroupUsersDataGridProps {
  group: UserGroup;
}

const GroupUsersDataGrid: React.FC<GroupUsersDataGridProps> = ({ group }) => {
  const {
    loading,
    validating,
    users,
    error: serviceError,
    refetch,
  } = useUsers({
    filters: { groups: { some: { id: group.id } } },
    orderBy: { username: 'asc' },
  });

  const { isManageGroupUsersDialogOpen, toggleManageGroupUsersDialog } =
    useGroupUsersDataGrid();

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isManageGroupUsersDialogOpen && <ManageGroupUsersDialog group={group} />}

      <GenericUsersDataGrid
        title={`Miembros del grupo (${users.length})`}
        users={users}
        onAddButtonClick={toggleManageGroupUsersDialog}
        onRefreshButtonClick={handleRefetch}
        enhancedDataGridProps={{
          density: 'compact',
          loading: loading || validating,
          error: serviceError,
          quickFilterProps: { placeholder: 'Buscar...' },
        }}
      />
    </>
  );
};

const GroupUsersDataGridWrapper: React.FC<GroupUsersDataGridProps> = (
  props
) => (
  <GroupUsersDataGridProvider>
    <GroupUsersDataGrid {...props} />
  </GroupUsersDataGridProvider>
);

export { GroupUsersDataGridWrapper as GroupUsersDataGrid };

export default GroupUsersDataGridWrapper;
