import { useMemo } from 'react';
import { Stack, Divider, MenuItem } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { NumberField, ControlledCheckbox, ControlledSelect } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../context';

export const FilesFormFieldConfig: React.FC = () => {
  const {
    formState: { isSubmitting, errors },
    register,
    control,
  } = useFormContext<EditFormFieldDialogData>();

  const labels = useMemo(
    () => ({
      image: 'Imágenes',
      video: 'Videos',
      audio: 'Audios',
      files: 'Archivos',
    }),
    []
  );

  return (
    <Stack spacing={2} divider={<Divider flexItem />}>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <ControlledCheckbox
          name="config.required"
          label="¿Campo requerido?"
          control={control as unknown as Control}
          formControlProps={{ disabled: isSubmitting }}
        />

        <ControlledCheckbox
          name="config.multiple"
          label="¿Campo múltiple?"
          control={control as unknown as Control}
          formControlProps={{ disabled: isSubmitting }}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <NumberField
          fullWidth
          size="small"
          autoComplete="off"
          label="Archivos mínimos"
          disabled={isSubmitting}
          inputProps={register('config.minFiles', { valueAsNumber: true })}
          error={Boolean(errors.config?.minFiles)}
          helperText={errors.config?.minFiles?.message}
        />

        <NumberField
          fullWidth
          size="small"
          autoComplete="off"
          label="Archivos máximos"
          disabled={isSubmitting}
          inputProps={register('config.maxFiles', { valueAsNumber: true })}
          error={Boolean(errors.config?.maxFiles)}
          helperText={errors.config?.maxFiles?.message}
        />
      </Stack>

      <ControlledSelect
        name="config.accept"
        label="Tipos de archivos aceptados"
        control={control as unknown as Control}
        formControlProps={{
          fullWidth: true,
          size: 'small',
          required: true,
          disabled: isSubmitting,
        }}
        selectProps={{
          multiple: true,
          renderValue: (selected) =>
            Array.isArray(selected) &&
            selected
              .map((value: string) => labels[value as keyof typeof labels])
              .sort()
              .join(', '),
        }}
        controllerProps={{
          defaultValue: [],
          rules: {
            required: {
              value: true,
              message: 'Debe completar este campo',
            },
          },
        }}
      >
        <MenuItem value="image">
          Imágenes (JPEG, PNG, GIF, SVG, TIFF, ICO)
        </MenuItem>

        <MenuItem value="video">
          Videos (MPEG, MP4, Quicktime, WMV, AVI, FLV)
        </MenuItem>

        <MenuItem value="audio">Audios (MP3, WAV, OGG)</MenuItem>

        <MenuItem value="files">
          Archivos (Text, CSV, JSON, PDF, Word, Excel, PowerPoint)
        </MenuItem>
      </ControlledSelect>
    </Stack>
  );
};

export default FilesFormFieldConfig;
