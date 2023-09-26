import { useCallback } from 'react';
import { useSession } from 'next-auth/react';

import { useAppAbility, useServicesRequests } from '@indocal/services';

import { GenericServicesRequestsDataGrid } from '@/features';

export const ServicesPendingRequestsDataGrid: React.FC = () => {
  const ability = useAppAbility();

  const { data: session } = useSession();

  const canRead = Boolean(session) && ability.can('read', 'serviceRequest');

  const {
    loading,
    validating,
    requests,
    count,
    error: serviceError,
    refetch,
  } = useServicesRequests({
    filters: {
      status: { notIn: ['COMPLETED', 'CANCELLED'] },
      currentStep: { owners: { some: { id: session?.user.id } } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <GenericServicesRequestsDataGrid
      title={`Mis solicitudes pendientes (${count})`}
      requests={requests}
      onRefreshButtonClick={canRead && handleRefetch}
      enhancedDataGridProps={{
        density: 'compact',
        loading: loading || validating,
        error: serviceError,
      }}
    />
  );
};

export default ServicesPendingRequestsDataGrid;
