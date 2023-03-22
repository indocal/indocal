import { useState, useCallback } from 'react';

import { useAbility, useOrders } from '@indocal/services';

import { GenericOrdersDataGrid } from '@/features';

import { OrdersDataGridProvider, useOrdersDataGrid } from './context';
import { AddOrderDialog } from './components';

const OrdersDataGrid: React.FC = () => {
  const ability = useAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    orders,
    count,
    error: serviceError,
    refetch,
  } = useOrders({
    ...(search && {
      filters: {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { code: { mode: 'insensitive', contains: search } },
          { supplier: { name: { mode: 'insensitive', contains: search } } },
        ],
      },
    }),
    pagination: {
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
    },
    orderBy: { createdAt: 'desc' },
  });

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
        title={`Ordenes (${count})`}
        orders={orders}
        onAddButtonClick={ability.can('create', 'order') && handleAdd}
        onRefreshButtonClick={ability.can('read', 'order') && handleRefetch}
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

const OrdersDataGridWrapper: React.FC = () => (
  <OrdersDataGridProvider>
    <OrdersDataGrid />
  </OrdersDataGridProvider>
);

export { OrdersDataGridWrapper as OrdersDataGrid };

export default OrdersDataGridWrapper;
