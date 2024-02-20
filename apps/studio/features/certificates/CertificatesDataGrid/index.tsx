import { useState, useCallback } from 'react';

import { useAppAbility, useServicesCertificates } from '@indocal/services';

import { GenericCertificatesDataGrid } from '@/features';

import { CertificatesDataGridProvider, useCertificatesDataGrid } from './context'
import { AddCertificateDialog } from './components'

const CertificatesDataGrid: React.FC= () => {
  const ability = useAppAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    certificates,
    count,
    error: serviceError,
    refetch,
  } = useServicesCertificates({
    ...(search && {
      filters: {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
        ],
      },
    }),
    pagination: {
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
    },
    orderBy: { createdAt: 'desc' },
  });

  const { isAddCertificateDialogOpen, toggleAddCertificateDialog } = useCertificatesDataGrid()

  const handleAdd = useCallback(
    () => toggleAddCertificateDialog(),
    [toggleAddCertificateDialog]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <>
      {isAddCertificateDialogOpen && <AddCertificateDialog />}

      <GenericCertificatesDataGrid
        title={`Certificados emitidos (${count.toLocaleString()})`}
        certificates={certificates}
        onAddButtonClick={ability.can('create', 'serviceCertificate') && handleAdd}
        onRefreshButtonClick={ability.can('read', 'log') && handleRefetch}
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

const CertificatesDataGridWrapper: React.FC = () => (
  <CertificatesDataGridProvider>
    <CertificatesDataGrid />
  </CertificatesDataGridProvider>
);

export { CertificatesDataGridWrapper as CertificatesDataGrid };

export default CertificatesDataGridWrapper;
