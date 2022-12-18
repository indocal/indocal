import { useCallback } from 'react';

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

  const {
    loading,
    validating,
    entries,
    error: serviceError,
    refetch,
  } = useFormsEntries({
    filters: { form: { id: form.id } },
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
      title={`Entradas (${entries.length})`}
      entries={entries}
      onAddButtonClick={ability.can('create', 'formEntry') && handleAdd}
      onRefreshButtonClick={ability.can('read', 'formEntry') && handleRefetch}
      enhancedDataGridProps={{
        density: 'compact',
        loading: loading || validating,
        error: serviceError,
        quickFilterProps: { placeholder: 'Buscar...' },
      }}
    />
  );
};

export default FormEntriesDataGrid;
