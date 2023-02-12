import { useState, useCallback } from 'react';

import { useAbility, useInventoryMovements } from '@indocal/services';

import { GenericInventoryMovementsDataGrid } from '@/features';

import {
  InventoryMovementsDataGridProvider,
  useInventoryMovementsDataGrid,
} from './context';
import { AddInventoryMovementDialog } from './components';

const InventoryMovementsDataGrid: React.FC = () => {
  const ability = useAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    movements,
    count,
    error: serviceError,
    refetch,
  } = useInventoryMovements({
    ...(search && {
      filters: {
        OR: [
          {
            id: { mode: 'insensitive', contains: search },
            concept: { mode: 'insensitive', contains: search },
          },
        ],
      },
    }),
    pagination: {
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
    },
    orderBy: { createdAt: 'desc' },
  });

  const { isAddInventoryMovementDialogOpen, toggleAddInventoryMovementDialog } =
    useInventoryMovementsDataGrid();

  const handleAdd = useCallback(
    () => toggleAddInventoryMovementDialog(),
    [toggleAddInventoryMovementDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddInventoryMovementDialogOpen && <AddInventoryMovementDialog />}

      <GenericInventoryMovementsDataGrid
        title={`Movimientos (${count})`}
        movements={movements}
        onAddButtonClick={
          ability.can('create', 'inventoryMovement') && handleAdd
        }
        onRefreshButtonClick={
          ability.can('read', 'inventoryMovement') && handleRefetch
        }
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

const InventoryMovementsDataGridWrapper: React.FC = () => (
  <InventoryMovementsDataGridProvider>
    <InventoryMovementsDataGrid />
  </InventoryMovementsDataGridProvider>
);

export { InventoryMovementsDataGridWrapper as InventoryMovementsDataGrid };

export default InventoryMovementsDataGridWrapper;