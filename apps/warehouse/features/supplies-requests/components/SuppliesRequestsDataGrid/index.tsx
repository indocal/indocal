import { useState, useCallback } from 'react';

import { useAbility, useSuppliesRequests } from '@indocal/services';

import { GenericSuppliesRequestsDataGrid } from '@/features';

export const SuppliesRequestsDataGrid: React.FC = () => {
  const ability = useAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    requests,
    count,
    error: serviceError,
    refetch,
  } = useSuppliesRequests({
    ...(search && {
      filters: {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { description: { mode: 'insensitive', contains: search } },
          { requestedBy: { email: { mode: 'insensitive', contains: search } } },
          { requestedBy: { name: { mode: 'insensitive', contains: search } } },
          {
            requestedBy: {
              username: {
                mode: 'insensitive',
                contains: search,
              },
            },
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

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      <GenericSuppliesRequestsDataGrid
        title={`Solicitudes (${count})`}
        requests={requests}
        onRefreshButtonClick={
          ability.can('read', 'supplyRequest') && handleRefetch
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

export default SuppliesRequestsDataGrid;
