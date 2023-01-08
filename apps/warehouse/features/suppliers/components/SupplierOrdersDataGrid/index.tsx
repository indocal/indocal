import { useCallback } from 'react';

import { useAbility, useOrders, Supplier } from '@indocal/services';

import { GenericOrdersDataGrid } from '@/features';

export interface SupplierOrdersDataGridProps {
  supplier: Supplier;
}

export const SupplierOrdersDataGrid: React.FC<SupplierOrdersDataGridProps> = ({
  supplier,
}) => {
  const ability = useAbility();

  const {
    loading,
    validating,
    orders,
    error: serviceError,
    refetch,
  } = useOrders({
    filters: { supplier: { id: supplier.id } },
    orderBy: { createdAt: 'desc' },
  });

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <GenericOrdersDataGrid
      title={`Ordenes realizadas (${orders.length})`}
      orders={orders}
      onRefreshButtonClick={ability.can('read', 'order') && handleRefetch}
      enhancedDataGridProps={{
        density: 'compact',
        loading: loading || validating,
        error: serviceError,
        quickFilterProps: { placeholder: 'Buscar...' },
      }}
    />
  );
};

export default SupplierOrdersDataGrid;
