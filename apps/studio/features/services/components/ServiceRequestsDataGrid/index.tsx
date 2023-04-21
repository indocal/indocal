import { useState, useCallback } from 'react';

import { useAppAbility, useServicesRequests, Service } from '@indocal/services';

import { GenericServicesRequestsDataGrid } from '@/features';

export interface ServiceRequestsDataGridProps {
  service: Service;
}

export const ServiceRequestsDataGrid: React.FC<
  ServiceRequestsDataGridProps
> = ({ service }) => {
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
  } = useServicesRequests({
    filters: {
      service: { id: service.id },
      ...(search && {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
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
    <GenericServicesRequestsDataGrid
      title={`Solicitudes (${count})`}
      requests={requests}
      onRefreshButtonClick={
        ability.can('read', 'serviceRequest') && handleRefetch
      }
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
  );
};

export default ServiceRequestsDataGrid;
