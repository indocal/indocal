import { useState, useCallback } from 'react';

import { useAbility, useUsersGroups } from '@indocal/services';

import { GenericUsersGroupsDataGrid } from '@/features';

import { UsersGroupsDataGridProvider, useUsersGroupsDataGrid } from './context';
import { AddUserGroupDialog } from './components';

const UsersGroupsDataGrid: React.FC = () => {
  const ability = useAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    groups,
    count,
    error: serviceError,
    refetch,
  } = useUsersGroups({
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

  const { isAddUserGroupDialogOpen, toggleAddUserGroupDialog } =
    useUsersGroupsDataGrid();

  const handleAdd = useCallback(
    () => toggleAddUserGroupDialog(),
    [toggleAddUserGroupDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddUserGroupDialogOpen && <AddUserGroupDialog />}

      <GenericUsersGroupsDataGrid
        title={`Grupos (${count})`}
        groups={groups}
        onAddButtonClick={ability.can('create', 'userGroup') && handleAdd}
        onRefreshButtonClick={ability.can('read', 'userGroup') && handleRefetch}
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

const UsersGroupsDataGridWrapper: React.FC = () => (
  <UsersGroupsDataGridProvider>
    <UsersGroupsDataGrid />
  </UsersGroupsDataGridProvider>
);

export { UsersGroupsDataGridWrapper as UsersGroupsDataGrid };

export default UsersGroupsDataGridWrapper;
