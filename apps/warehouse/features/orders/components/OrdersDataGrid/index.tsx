import { useCallback } from 'react';

import { useAbility, useOrders } from '@indocal/services';

import { GenericOrdersDataGrid } from '@/features';

import { OrdersDataGridProvider, useOrdersDataGrid } from './context';
import { AddOrderDialog } from './components';

const OrdersDataGrid: React.FC = () => {
  const ability = useAbility();

  const {
    loading,
    validating,
    orders,
    error: serviceError,
    refetch,
  } = useOrders({ orderBy: { createdAt: 'desc' } });

  const { isAddOrderDialogOpen, toggleAddOrderDialog } = useOrdersDataGrid();

  const handleAdd = useCallback(
    () => toggleAddOrderDialog(),
    [toggleAddOrderDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddOrderDialogOpen && <AddOrderDialog />}

      <GenericOrdersDataGrid
        title={`Ordenes (${orders.length})`}
        orders={orders}
        onAddButtonClick={ability.can('create', 'order') && handleAdd}
        onRefreshButtonClick={ability.can('read', 'order') && handleRefetch}
        enhancedDataGridProps={{
          loading: loading || validating,
          error: serviceError,
          quickFilterProps: { placeholder: 'Buscar...' },
        }}
      />
    </>
  );
};

const OrdersDataGridWrapper: React.FC = () => (
  <OrdersDataGridProvider>
    <OrdersDataGrid />
  </OrdersDataGridProvider>
);

export { OrdersDataGridWrapper as OrdersDataGrid };

export default OrdersDataGridWrapper;
