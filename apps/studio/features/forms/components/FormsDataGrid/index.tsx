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
    pagination: {
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
    },
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

const FormsDataGridWrapper: React.FC = () => (
  <FormsDataGridProvider>
    <FormsDataGrid />
  </FormsDataGridProvider>
);

export { FormsDataGridWrapper as FormsDataGrid };

export default FormsDataGridWrapper;
