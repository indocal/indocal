import { useState, useCallback } from 'react';

import { useAbility, useUsers, UserGroup } from '@indocal/services';

import { GenericUsersDataGrid } from '@/features';

import { GroupUsersDataGridProvider, useGroupUsersDataGrid } from './context';
import { ManageGroupUsersDialog } from './components';

export interface GroupUsersDataGridProps {
  group: UserGroup;
}

const GroupUsersDataGrid: React.FC<GroupUsersDataGridProps> = ({ group }) => {
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
      groups: { some: { id: group.id } },
      ...(search && {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { username: { mode: 'insensitive', contains: search } },
          { email: { mode: 'insensitive', contains: search } },
          { name: { mode: 'insensitive', contains: search } },
        ],
      }),
    },
    pagination: {
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
    },
    orderBy: { username: 'asc' },
  });

  const { isManageGroupUsersDialogOpen, toggleManageGroupUsersDialog } =
    useGroupUsersDataGrid();

  const handleAdd = useCallback(
    () => toggleManageGroupUsersDialog(),
    [toggleManageGroupUsersDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isManageGroupUsersDialogOpen && <ManageGroupUsersDialog group={group} />}

      <GenericUsersDataGrid
        title={`Miembros del grupo (${count})`}
        users={users}
        onAddButtonClick={
          ability.can('update', 'userGroup') &&
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

const GroupUsersDataGridWrapper: React.FC<GroupUsersDataGridProps> = (
  props
) => (
  <GroupUsersDataGridProvider>
    <GroupUsersDataGrid {...props} />
  </GroupUsersDataGridProvider>
);

export { GroupUsersDataGridWrapper as GroupUsersDataGrid };

export default GroupUsersDataGridWrapper;
