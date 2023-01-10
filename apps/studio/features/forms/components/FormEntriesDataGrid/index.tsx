import { useState, useCallback } from 'react';

import { useAbility, useFormsEntries, Form } from '@indocal/services';

import { GenericFormsEntriesDataGrid } from '@/features';
import { Pages } from '@/config';

export interface FormEntriesDataGridProps {
  form: Form;
}

export const FormEntriesDataGrid: React.FC<FormEntriesDataGridProps> = ({
  form,
}) => {
  const ability = useAbility();

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    entries,
    count,
    error: serviceError,
    refetch,
  } = useFormsEntries({
    filters: {
      form: { id: form.id },
      ...(search && {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { answeredBy: { email: { mode: 'insensitive', contains: search } } },
          { answeredBy: { name: { mode: 'insensitive', contains: search } } },
          {
            answeredBy: {
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

  const handleAdd = useCallback(() => {
    window.open(`${Pages.FORMS_PREVIEW}/${form.id}`, '_blank');
  }, [form.id]);

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <GenericFormsEntriesDataGrid
      title={`Entradas (${count})`}
      entries={entries}
      onAddButtonClick={ability.can('create', 'formEntry') && handleAdd}
      onRefreshButtonClick={ability.can('read', 'formEntry') && handleRefetch}
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
        page: pagination.page,
        pageSize: pagination.pageSize,
        onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
        onPageSizeChange: (pageSize) =>
          setPagination((prev) => ({ ...prev, pageSize })),
      }}
    />
  );
};

export default FormEntriesDataGrid;
