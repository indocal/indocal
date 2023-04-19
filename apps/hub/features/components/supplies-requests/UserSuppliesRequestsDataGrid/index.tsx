import { useState, useCallback } from 'react';

import {
  useAppAbility,
  useSuppliesRequests,
  UUID,
  User,
} from '@indocal/services';

import { GenericUserSuppliesRequestsDataGrid } from '@/features';

import {
  UserSuppliesRequestsDataGridProvider,
  useUserSuppliesRequestsDataGrid,
} from './context';
import { AddSupplyRequestDialog } from './components';

export interface UserSuppliesRequestsDataGridProps {
  user: UUID | User;
}

const UserSuppliesRequestsDataGrid: React.FC<
  UserSuppliesRequestsDataGridProps
> = ({ user }) => {
  const ability = useAppAbility();

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

  const { isAddSupplyRequestDialogOpen, toggleAddSupplyRequestDialog } =
    useUserSuppliesRequestsDataGrid();

  const handleAdd = useCallback(
    () => toggleAddSupplyRequestDialog(),
    [toggleAddSupplyRequestDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddSupplyRequestDialogOpen && <AddSupplyRequestDialog user={user} />}

      <GenericUserSuppliesRequestsDataGrid
        title={`Solicitudes (${count})`}
        requests={requests}
        onAddButtonClick={ability.can('create', 'supplyRequest') && handleAdd}
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

const UserSuppliesRequestsDataGridWrapper: React.FC<
  UserSuppliesRequestsDataGridProps
> = (props) => (
  <UserSuppliesRequestsDataGridProvider>
    <UserSuppliesRequestsDataGrid {...props} />
  </UserSuppliesRequestsDataGridProvider>
);

export { UserSuppliesRequestsDataGridWrapper as UserSuppliesRequestsDataGrid };

export default UserSuppliesRequestsDataGridWrapper;
