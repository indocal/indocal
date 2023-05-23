import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';

import { INDOCAL, UUID, Form } from '@indocal/services';

export type ExportFormEntriesHookParams = {
  form: UUID | Form;
  client: INDOCAL;
};

export interface ExportFormEntriesHookReturn {
  downloading: boolean;
  download: (year: Date) => Promise<void>;
}

export function useExportFormEntries({
  form,
  client,
}: ExportFormEntriesHookParams): ExportFormEntriesHookReturn {
  const { enqueueSnackbar } = useSnackbar();

  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(
    async (year: Date) => {
      setDownloading(true);

      const { blob, error } = await client.forms.exportFormEntries(
        typeof form === 'string' ? form : form.id,
        { year }
      );

      if (error) {
        enqueueSnackbar(
          error.details
            ? error.details.reduce(
                (acc, current) => (acc ? `${acc} | ${current}` : current),
                ``
              )
            : error.message,
          { variant: 'error' }
        );
      } else {
        const url = window.URL.createObjectURL(blob as Blob);

        const link = document.createElement('a');

        link.href = url;

        link.download =
          typeof form === 'object' ? form.title + '.csv' : 'data.csv';

        link.click();

        window.URL.revokeObjectURL(url);
      }

      setDownloading(false);
    },

    [form, client, enqueueSnackbar]
  );

  return {
    downloading,
    download: handleDownload,
  };
}

export default useExportFormEntries;
