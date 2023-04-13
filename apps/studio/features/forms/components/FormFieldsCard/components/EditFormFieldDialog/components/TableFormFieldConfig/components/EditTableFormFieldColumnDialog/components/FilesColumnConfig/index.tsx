import { useMemo } from 'react';
import { Stack, Divider, MenuItem } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import {
  NumberTextField,
  ControlledCheckbox,
  ControlledSelect,
} from '@indocal/ui';

import { EditFormFieldDialogData } from '../../../../../../context';

export interface FilesColumnConfigProps {
  column: number;
}

export const FilesColumnConfig: React.FC<FilesColumnConfigProps> = ({
  column,
}) => {
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
          name={`config.columns.${column}.config.required`}
          label="¿Campo requerido?"
          control={control as unknown as Control}
          formControlProps={{ disabled: isSubmitting }}
        />

        <ControlledCheckbox
          name={`config.columns.${column}.config.multiple`}
          label="¿Campo múltiple?"
          control={control as unknown as Control}
          formControlProps={{ disabled: isSubmitting }}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <NumberTextField
          fullWidth
          size="small"
          autoComplete="off"
          label="Archivos mínimos"
          disabled={isSubmitting}
          inputProps={register(`config.columns.${column}.config.minFiles`, {
            valueAsNumber: true,
          })}
          error={Boolean(
            errors.config &&
              errors.config?.columns &&
              errors.config?.columns[column] &&
              errors.config?.columns[column]?.config &&
              errors.config?.columns[column]?.config?.minFiles?.message
          )}
          helperText={
            errors.config &&
            errors.config?.columns &&
            errors.config?.columns[column] &&
            errors.config?.columns[column]?.config &&
            errors.config?.columns[column]?.config?.minFiles?.message
          }
        />

        <NumberTextField
          fullWidth
          size="small"
          autoComplete="off"
          label="Archivos máximos"
          disabled={isSubmitting}
          inputProps={register(`config.columns.${column}.config.maxFiles`, {
            valueAsNumber: true,
          })}
          error={Boolean(
            errors.config &&
              errors.config?.columns &&
              errors.config?.columns[column] &&
              errors.config?.columns[column]?.config &&
              errors.config?.columns[column]?.config?.maxFiles?.message
          )}
          helperText={
            errors.config &&
            errors.config?.columns &&
            errors.config?.columns[column] &&
            errors.config?.columns[column]?.config &&
            errors.config?.columns[column]?.config?.maxFiles?.message
          }
        />
      </Stack>

      <ControlledSelect
        name={`config.columns.${column}.config.accept`}
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

export default FilesColumnConfig;
