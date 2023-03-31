import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ControlledFilesDropzone } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  FilesFormFieldConfig,
} from '@indocal/services';

export interface FilesColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const FilesColumn: React.FC<FilesColumnProps> = ({
  field,
  column,
  row,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<FilesFormFieldConfig | null>(
    () => column.config as FilesFormFieldConfig,
    [column.config]
  );

  return (
    <ControlledFilesDropzone
      size="small"
      required={config?.required}
      multiple={config?.multiple}
      name={`${field.id}.${row}.${column.id}`}
      control={control}
      disabled={isSubmitting}
      dropzoneProps={{
        maxFiles: config?.maxFiles,
        accept: {
          ...(config?.accept?.includes('image') && {
            'image/*': [
              '.jpg',
              '.jpeg',
              '.png',
              '.gif',
              '.svg',
              '.tiff',
              '.ico',
            ],
          }),

          ...(config?.accept?.includes('video') && {
            'video/*': ['.mpeg', '.mp4', '.mov', '.wmv', '.avi', '.flv'],
          }),

          ...(config?.accept?.includes('audio') && {
            'audio/*': ['.mp3', '.wav', '.ogg'],
          }),

          ...(config?.accept?.includes('files') && {
            'text/*': ['.txt', '.csv'],
            'application/json': ['.json'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc', '.docx'],
            'application/msexcel': ['.xls', '.xlsx'],
            'aplication/mspowerpoint': ['.ppt', '.pptx'],
          }),
        },
      }}
      controllerProps={{
        rules: {
          required: {
            value: Boolean(config?.required),
            message: 'Debe completar este campo',
          },

          ...(config?.multiple && {
            validate: {
              ...(config?.minFiles && {
                minFiles: (value) =>
                  value.length >= config.minFiles ||
                  `Debe ingresar al menos ${config.minFiles} archivos`,
              }),

              ...(config?.maxFiles && {
                maxFiles: (value) =>
                  value.length <= config.maxFiles ||
                  `Debe ingresar como máximo ${config.maxFiles} archivos`,
              }),
            },
          }),
        },
      }}
    />
  );
};

export default FilesColumn;
