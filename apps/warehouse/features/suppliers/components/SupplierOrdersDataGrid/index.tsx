import { useState, useCallback } from 'react';

import { useAbility, useOrders, Supplier } from '@indocal/services';

import { GenericOrdersDataGrid } from '@/features';

export interface SupplierOrdersDataGridProps {
  supplier: Supplier;
}

export const SupplierOrdersDataGrid: React.FC<SupplierOrdersDataGridProps> = ({
  supplier,
}) => {
  const ability = useAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    orders,
    count,

    refetch,
  } = useOrders({
    filters: {
      supplier: { id: supplier.id },
      ...(search && {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { code: { mode: 'insensitive', contains: search } },
        ],
      }),
    },
    pagination: {
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
    },
    orderBy: { createdAt: 'desc' },
  });

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <GenericOrdersDataGrid
      title={`Ordenes realizadas (${count})`}
      orders={orders}
      onRefreshButtonClick={ability.can('read', 'order') && handleRefetch}
      enhancedDataGridProps={{
        density: 'compact',
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
  );
};

export default SupplierOrdersDataGrid;
