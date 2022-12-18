import { useCallback } from 'react';

import { useAbility, useForms, UserGroup } from '@indocal/services';

import { GenericFormsDataGrid } from '@/features';

import { GroupFormsDataGridProvider, useGroupFormsDataGrid } from './context';
import { AddGroupFormDialog } from './components';

export interface GroupFormsDataGridProps {
  group: UserGroup;
}

const GroupFormsDataGrid: React.FC<GroupFormsDataGridProps> = ({ group }) => {
  const ability = useAbility();

  const {
    loading,
    validating,
    forms,
    error: serviceError,
    refetch,
  } = useForms({
    filters: { group: { id: group.id } },
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
        title={`Formularios del grupo (${forms.length})`}
        forms={forms}
        onAddButtonClick={ability.can('create', 'form') && handleAdd}
        onRefreshButtonClick={ability.can('read', 'form') && handleRefetch}
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

const GroupFormsDataGridWrapper: React.FC<GroupFormsDataGridProps> = (
  props
) => (
  <GroupFormsDataGridProvider>
    <GroupFormsDataGrid {...props} />
  </GroupFormsDataGridProvider>
);

export { GroupFormsDataGridWrapper as GroupFormsDataGrid };

export default GroupFormsDataGrid;
