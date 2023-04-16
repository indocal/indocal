import { useState, useCallback } from 'react';

import { useAbility, useServices } from '@indocal/services';

import { GenericServicesDataGrid } from '@/features';

import { ServicesDataGridProvider, useServicesDataGrid } from './context';
import { AddServiceDialog } from './components';

const ServicesDataGrid: React.FC = () => {
  const ability = useAbility();

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
    ...(search && {
      filters: {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { title: { mode: 'insensitive', contains: search } },
          { description: { mode: 'insensitive', contains: search } },
        ],
      },
    }),
    pagination: {
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
    },
    orderBy: { title: 'asc' },
  });

  const { isAddServiceDialogOpen, toggleAddServiceDialog } =
    useServicesDataGrid();

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
        title={`Servicios (${count})`}
        services={services}
        onAddButtonClick={
          ability.can('create', 'service') &&
          ability.can('read', 'form') &&
          handleAdd
        }
        onRefreshButtonClick={ability.can('read', 'service') && handleRefetch}
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

const ServicesDataGridWrapper: React.FC = () => (
  <ServicesDataGridProvider>
    <ServicesDataGrid />
  </ServicesDataGridProvider>
);

export { ServicesDataGridWrapper as ServicesDataGrid };

export default ServicesDataGridWrapper;