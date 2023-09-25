import { useState, useCallback } from 'react';

import { useAppAbility, useSupplies } from '@indocal/services';

import { GenericSuppliesDataGrid } from '@/features';

import { SuppliesDataGridProvider, useSuppliesDataGrid } from './context';
import { AddSupplyDialog } from './components';

const SuppliesDataGrid: React.FC = () => {
  const ability = useAppAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    supplies,
    count,
    error: serviceError,
    refetch,
  } = useSupplies({
    ...(search && {
      filters: {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { code: { mode: 'insensitive', contains: search } },
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

  const { isAddSupplyDialogOpen, toggleAddSupplyDialog } =
    useSuppliesDataGrid();

  const handleAdd = useCallback(
    () => toggleAddSupplyDialog(),
    [toggleAddSupplyDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddSupplyDialogOpen && <AddSupplyDialog />}

      <GenericSuppliesDataGrid
        title={`Recursos (${count.toLocaleString()})`}
        supplies={supplies}
        onAddButtonClick={ability.can('create', 'supply') && handleAdd}
        onRefreshButtonClick={ability.can('read', 'supply') && handleRefetch}
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

const SuppliesDataGridWrapper: React.FC = () => (
  <SuppliesDataGridProvider>
    <SuppliesDataGrid />
  </SuppliesDataGridProvider>
);

export { SuppliesDataGridWrapper as SuppliesDataGrid };

export default SuppliesDataGridWrapper;
