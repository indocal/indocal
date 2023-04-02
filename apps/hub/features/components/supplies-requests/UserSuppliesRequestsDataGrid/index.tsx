import { useState, useCallback } from 'react';

import { useAbility, useSuppliesRequests, UUID, User } from '@indocal/services';

import { GenericUserSuppliesRequestsDataGrid } from '@/features';

export interface UserSuppliesRequestsDataGridProps {
  user: UUID | User;
}

export const UserSuppliesRequestsDataGrid: React.FC<
  UserSuppliesRequestsDataGridProps
> = ({ user }) => {
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
    filters: {
      requestedBy: { id: typeof user === 'string' ? user : user.id },
      ...(search && {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { description: { mode: 'insensitive', contains: search } },
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
    <>
      <GenericUserSuppliesRequestsDataGrid
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

export default UserSuppliesRequestsDataGrid;
