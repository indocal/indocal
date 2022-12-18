import { useCallback } from 'react';

import { useAbility, useForms } from '@indocal/services';

import { GenericFormsDataGrid } from '@/features';

import { FormsDataGridProvider, useFormsDataGrid } from './context';
import { AddFormDialog } from './components';

const FormsDataGrid: React.FC = () => {
  const ability = useAbility();

  const {
    loading,
    validating,
    forms,
    error: serviceError,
    refetch,
  } = useForms({ orderBy: { title: 'asc' } });

  const { isAddFormDialogOpen, toggleAddFormDialog } = useFormsDataGrid();

  const handleAdd = useCallback(
    () => toggleAddFormDialog(),
    [toggleAddFormDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddFormDialogOpen && <AddFormDialog />}

      <GenericFormsDataGrid
        title={`Formularios (${forms.length})`}
        forms={forms}
        onAddButtonClick={
          ability.can('create', 'form') &&
          ability.can('read', 'userGroup') &&
          handleAdd
        }
        onRefreshButtonClick={ability.can('read', 'form') && handleRefetch}
        enhancedDataGridProps={{
          loading: loading || validating,
          error: serviceError,
          quickFilterProps: { placeholder: 'Buscar...' },
        }}
      />
    </>
  );
};

const FormsDataGridWrapper: React.FC = () => (
  <FormsDataGridProvider>
    <FormsDataGrid />
  </FormsDataGridProvider>
);

export { FormsDataGridWrapper as FormsDataGrid };

export default FormsDataGridWrapper;
