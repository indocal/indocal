import { useState } from 'react';
import {
  Stack,
  Divider,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Code as CodeIcon, Preview as PreviewIcon } from '@mui/icons-material';
import { useFormContext, Control } from 'react-hook-form';

import { NoData, Markdown, ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../context';

import { ControlledHintPositionSelect } from './components';

export const FormFieldHintConfig: React.FC = () => {
  const {
    formState: { isSubmitting, errors },
    register,
    control,
    watch,
  } = useFormContext<EditFormFieldDialogData>();

  const [view, setView] = useState<'CODE' | 'PREVIEW'>('CODE');

  const include = watch('config.hint.include');
  const content = watch('config.hint.content');

  return (
    <Stack spacing={2} divider={<Divider flexItem />}>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <ControlledCheckbox
          name="config.hint.include"
          label="¿Incluir leyenda?"
          control={control as unknown as Control}
          controllerProps={{ defaultValue: false }}
          formControlProps={{ fullWidth: true, disabled: isSubmitting }}
        />

        <ControlledHintPositionSelect
          name="config.hint.position"
          label="Posición de la leyenda"
          control={control as unknown as Control}
          disabled={isSubmitting}
          controllerProps={{ defaultValue: 'BEFORE' }}
          formControlProps={{
            fullWidth: true,
            size: 'small',
          }}
        />
      </Stack>

      {include && (
        <Stack alignItems="flex-end" spacing={2}>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={view}
            onChange={(_, value) => setView(value)}
            sx={{
              position: 'sticky',
              top: (theme) => theme.spacing(2),
              zIndex: 1,
            }}
          >
            <ToggleButton value="CODE">
              <CodeIcon />
            </ToggleButton>

            <ToggleButton value="PREVIEW">
              <PreviewIcon />
            </ToggleButton>
          </ToggleButtonGroup>

          {view === 'CODE' ? (
            <TextField
              fullWidth
              multiline
              size="small"
              autoComplete="off"
              label="Leyenda"
              disabled={isSubmitting}
              inputProps={register('config.hint.content')}
              error={Boolean(errors.config?.hint?.content)}
              helperText={errors.config?.hint?.content?.message}
            />
          ) : content ? (
            <Markdown>{content}</Markdown>
          ) : (
            <NoData message="Ingrese una leyenda para ver su vista previa" />
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default FormFieldHintConfig;
