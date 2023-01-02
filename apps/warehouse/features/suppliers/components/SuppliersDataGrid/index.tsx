import { useCallback } from 'react';

import { useAbility, useSuppliers } from '@indocal/services';

import { GenericSuppliersDataGrid } from '@/features';

import { SuppliersDataGridProvider, useSuppliersDataGrid } from './context';
import { AddSupplierDialog } from './components';

const SuppliersDataGrid: React.FC = () => {
  const ability = useAbility();

  const {
    loading,
    validating,
    suppliers,
    error: serviceError,
    refetch,
  } = useSuppliers({ orderBy: { name: 'asc' } });

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
        title={`Suplidores (${suppliers.length})`}
        suppliers={suppliers}
        onAddButtonClick={ability.can('create', 'supplier') && handleAdd}
        onRefreshButtonClick={ability.can('read', 'supplier') && handleRefetch}
        enhancedDataGridProps={{
          loading: loading || validating,
          error: serviceError,
          quickFilterProps: { placeholder: 'Buscar...' },
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
