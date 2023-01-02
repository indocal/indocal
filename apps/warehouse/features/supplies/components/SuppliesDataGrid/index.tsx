import { useCallback } from 'react';

import { useAbility, useSupplies } from '@indocal/services';

import { GenericSuppliesDataGrid } from '@/features';

import { SuppliesDataGridProvider, useSuppliesDataGrid } from './context';
import { AddSupplyDialog } from './components';

const SuppliesDataGrid: React.FC = () => {
  const ability = useAbility();

  const {
    loading,
    validating,
    supplies,
    error: serviceError,
    refetch,
  } = useSupplies({ orderBy: { name: 'asc' } });

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
        title={`Recursos (${supplies.length})`}
        supplies={supplies}
        onAddButtonClick={ability.can('create', 'supply') && handleAdd}
        onRefreshButtonClick={ability.can('read', 'supply') && handleRefetch}
        enhancedDataGridProps={{
          loading: loading || validating,
          error: serviceError,
          quickFilterProps: { placeholder: 'Buscar...' },
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
