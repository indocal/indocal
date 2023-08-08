import { useMemo } from 'react';
import { Stack, Typography, Badge } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { ControlledFilesDropzone } from '@indocal/ui';
import { Form, FilesFormFieldConfig } from '@indocal/services';

export interface FilesFormFieldProps {
  field: Form['fields'][number];
}

export const FilesFormField: React.FC<FilesFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting, errors },
    control,
  } = useFormContext();

  const config = useMemo<FilesFormFieldConfig | null>(
    () => field.config as FilesFormFieldConfig | null,
    [field.config]
  );

  return (
    <Stack
      sx={{
        display: 'grid',
        gap: (theme) => theme.spacing(1),
        padding: (theme) => theme.spacing(2),
        borderRadius: (theme) => theme.spacing(0.5),
        border: (theme) =>
          errors[field.id]
            ? `1px solid ${theme.palette.error.main}`
            : `1px solid ${theme.palette.divider}`,
      }}
    >
      <Badge
        badgeContent="*"
        invisible={!config?.required}
        slotProps={{
          badge: { style: { top: 5, right: -5 } },
        }}
        sx={{
          width: 'fit-content',
          ...(errors[field.id] && {
            color: (theme) => theme.palette.error.main,
          }),
        }}
      >
        <Typography>{field.title}</Typography>
      </Badge>

      <ControlledFilesDropzone
        required={config?.required}
        multiple={config?.multiple}
        name={field.id}
        description={field.description}
        control={control}
        disabled={isSubmitting}
        dropzoneProps={{
          maxSize: 5 * 1024 * 1024,
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
        formHelperTextProps={{
          sx: {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
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
    </Stack>
  );
};

export default FilesFormField;
