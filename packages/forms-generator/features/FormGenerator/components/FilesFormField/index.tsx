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
    () => field.config as FilesFormFieldConfig,
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
        componentsProps={{
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
        control={control}
        disabled={isSubmitting}
        controllerProps={{
          rules: {
            required: {
              value: Boolean(config?.required),
              message: 'Debe completar este campo',
            },
          },
        }}
      />
    </Stack>
  );
};

export default FilesFormField;
