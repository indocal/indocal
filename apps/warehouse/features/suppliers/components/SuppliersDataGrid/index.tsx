import { useState, useCallback } from 'react';

import { useAbility, useSuppliers } from '@indocal/services';

import { GenericSuppliersDataGrid } from '@/features';

import { SuppliersDataGridProvider, useSuppliersDataGrid } from './context';
import { AddSupplierDialog } from './components';

const SuppliersDataGrid: React.FC = () => {
  const ability = useAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    suppliers,
    count,
    error: serviceError,
    refetch,
  } = useSuppliers({
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

  const { isAddSupplierDialogOpen, toggleAddSupplierDialog } =
    useSuppliersDataGrid();

  const handleAdd = useCallback(
    () => toggleAddSupplierDialog(),
    [toggleAddSupplierDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddSupplierDialogOpen && <AddSupplierDialog />}

      <GenericSuppliersDataGrid
        title={`Suplidores (${count})`}
        suppliers={suppliers}
        onAddButtonClick={ability.can('create', 'supplier') && handleAdd}
        onRefreshButtonClick={ability.can('read', 'supplier') && handleRefetch}
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

const SuppliersDataGridWrapper: React.FC = () => (
  <SuppliersDataGridProvider>
    <SuppliersDataGrid />
  </SuppliersDataGridProvider>
);

export { SuppliersDataGridWrapper as SuppliersDataGrid };

export default SuppliersDataGridWrapper;
