import { useState, useCallback } from 'react';

import { useAbility, useForms, UserGroup } from '@indocal/services';

import { GenericFormsDataGrid } from '@/features';

import { GroupFormsDataGridProvider, useGroupFormsDataGrid } from './context';
import { AddGroupFormDialog } from './components';

export interface GroupFormsDataGridProps {
  group: UserGroup;
}

const GroupFormsDataGrid: React.FC<GroupFormsDataGridProps> = ({ group }) => {
  const ability = useAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    forms,
    count,
    error: serviceError,
    refetch,
  } = useForms({
    filters: {
      group: { id: group.id },
      ...(search && {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { title: { mode: 'insensitive', contains: search } },
          { description: { mode: 'insensitive', contains: search } },
        ],
      }),
    },
    pagination: {
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
    },
    orderBy: { title: 'asc' },
  });

  const { isAddGroupFormDialogOpen, toggleAddGroupFormDialog } =
    useGroupFormsDataGrid();

  const handleAdd = useCallback(
    () => toggleAddGroupFormDialog(),
    [toggleAddGroupFormDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddGroupFormDialogOpen && <AddGroupFormDialog group={group} />}

      <GenericFormsDataGrid
        title={`Formularios del grupo (${count})`}
        forms={forms}
        onAddButtonClick={ability.can('create', 'form') && handleAdd}
        onRefreshButtonClick={ability.can('read', 'form') && handleRefetch}
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

const GroupFormsDataGridWrapper: React.FC<GroupFormsDataGridProps> = (
  props
) => (
  <GroupFormsDataGridProvider>
    <GroupFormsDataGrid {...props} />
  </GroupFormsDataGridProvider>
);

export { GroupFormsDataGridWrapper as GroupFormsDataGrid };

export default GroupFormsDataGrid;
