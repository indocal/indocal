import { useState, useCallback } from 'react';

import { useAppAbility, useServices, UserGroup } from '@indocal/services';

import { GenericServicesDataGrid } from '@/features';

import {
  GroupServicesDataGridProvider,
  useGroupServicesDataGrid,
} from './context';
import { AddServiceDialog } from './components';

export interface GroupServicesDataGridProps {
  group: UserGroup;
}

const GroupServicesDataGrid: React.FC<GroupServicesDataGridProps> = ({
  group,
}) => {
  const ability = useAppAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    services,
    count,
    error: serviceError,
    refetch,
  } = useServices({
    filters: {
      form: { group: { id: group.id } },
      ...(search && {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { title: { mode: 'insensitive', contains: search } },
          { description: { mode: 'insensitive', contains: search } },
        ],
      }),
    },
    pagination: {
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
    },
    orderBy: { title: 'asc' },
  });

  const { isAddServiceDialogOpen, toggleAddServiceDialog } =
    useGroupServicesDataGrid();

  const handleAdd = useCallback(
    () => toggleAddServiceDialog(),
    [toggleAddServiceDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddServiceDialogOpen && <AddServiceDialog />}

      <GenericServicesDataGrid
        title={`Servicios del grupo (${count.toLocaleString()})`}
        services={services}
        onAddButtonClick={
          ability.can('create', 'service') &&
          ability.can('read', 'form') &&
          handleAdd
        }
        onRefreshButtonClick={ability.can('read', 'service') && handleRefetch}
        enhancedDataGridProps={{
          density: 'compact',
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

const GroupServicesDataGridWrapper: React.FC<GroupServicesDataGridProps> = ({
  group,
}) => (
  <GroupServicesDataGridProvider>
    <GroupServicesDataGrid group={group} />
  </GroupServicesDataGridProvider>
);

export { GroupServicesDataGridWrapper as GroupServicesDataGrid };

export default GroupServicesDataGridWrapper;
