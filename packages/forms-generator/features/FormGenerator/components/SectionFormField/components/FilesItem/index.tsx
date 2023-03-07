import { useMemo } from 'react';
import { Stack, Typography, Badge } from '@mui/material';
import { useFormContext, FieldErrors } from 'react-hook-form';

import { ControlledFilesDropzone } from '@indocal/ui';
import {
  Form,
  SectionFormFieldItem,
  FilesFormFieldConfig,
} from '@indocal/services';

export interface FilesItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const FilesItem: React.FC<FilesItemProps> = ({ field, item }) => {
  const {
    formState: { isSubmitting, errors },
    control,
  } = useFormContext();

  const config = useMemo<FilesFormFieldConfig | null>(
    () => item.config as FilesFormFieldConfig,
    [item.config]
  );

  return (
    <Stack
      sx={{
        display: 'grid',
        gap: (theme) => theme.spacing(1),
        padding: (theme) => theme.spacing(1, 2, 1.5),
        borderRadius: (theme) => theme.spacing(0.5),
        border: (theme) =>
          errors[field.id] && (errors[field.id] as FieldErrors)[item.title]
            ? `1px solid ${theme.palette.error.main}`
            : `1px solid ${theme.palette.divider}`,
      }}
    >
      <Badge
        badgeContent="*"
        invisible={!config?.required}
        componentsProps={{
          badge: { style: { top: 5, right: -5 } },
        }}
        sx={{
          width: 'fit-content',
          ...(errors[field.id] &&
            (errors[field.id] as FieldErrors)[item.title] && {
              color: (theme) => theme.palette.error.main,
            }),
        }}
      >
        <Typography>{item.title}</Typography>
      </Badge>

      <ControlledFilesDropzone
        required={config?.required}
        multiple={config?.multiple}
        name={`${field.id}.${item.title}`}
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
    </Stack>
  );
};

export default FilesItem;
