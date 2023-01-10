import { useState, useCallback } from 'react';

import { useAbility, useForms } from '@indocal/services';

import { GenericFormsDataGrid } from '@/features';

import { FormsDataGridProvider, useFormsDataGrid } from './context';
import { AddFormDialog } from './components';

const FormsDataGrid: React.FC = () => {
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
    ...(search && {
      filters: {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { title: { mode: 'insensitive', contains: search } },
          { description: { mode: 'insensitive', contains: search } },
        ],
      },
    }),
    orderBy: { title: 'asc' },
  });

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
        title={`Formularios (${count})`}
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

const FormsDataGridWrapper: React.FC = () => (
  <FormsDataGridProvider>
    <FormsDataGrid />
  </FormsDataGridProvider>
);

export { FormsDataGridWrapper as FormsDataGrid };

export default FormsDataGridWrapper;
