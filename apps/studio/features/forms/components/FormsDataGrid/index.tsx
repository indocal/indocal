import { useCallback } from 'react';

import { useForms } from '@indocal/services';

import { GenericFormsDataGrid } from '@/features';

import { FormsDataGridProvider, useFormsDataGrid } from './context';
import { AddFormDialog } from './components';

const FormsDataGrid: React.FC = () => {
  const {
    loading,
    validating,
    forms,
    error: serviceError,
    refetch,
  } = useForms({ orderBy: { title: 'asc' } });

  const { isAddFormDialogOpen, toggleAddFormDialog } = useFormsDataGrid();

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddFormDialogOpen && <AddFormDialog />}

      <GenericFormsDataGrid
        title={`Formularios (${forms.length})`}
        forms={forms}
        onAddButtonClick={toggleAddFormDialog}
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

const FormsDataGridWrapper: React.FC = () => (
  <FormsDataGridProvider>
    <FormsDataGrid />
  </FormsDataGridProvider>
);

export { FormsDataGridWrapper as FormsDataGrid };

export default FormsDataGridWrapper;
