import { useState } from 'react';
import {
  Stack,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';
import { Code as CodeIcon, Preview as PreviewIcon } from '@mui/icons-material';
import { Editor } from '@monaco-editor/react';
import { useFormContext, Controller, Control } from 'react-hook-form';

import { Loader, NoData, Markdown, ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../context';

import { ControlledHintPositionSelect } from './components';

export const FormFieldHintConfig: React.FC = () => {
  const {
    formState: { isSubmitting },
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
            <Controller
              name="config.hint.content"
              control={control}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Stack
                  spacing={1}
                  sx={{
                    width: '100%',
                    ...(error && {
                      padding: (theme) => theme.spacing(1.5),
                      borderRadius: (theme) => theme.spacing(0.5),
                      border: (theme) =>
                        `1px solid ${theme.palette.error.main}`,
                    }),
                  }}
                >
                  <Editor
                    language="markdown"
                    theme="vs-dark"
                    height={275}
                    loading={<Loader invisible message="Cargando editor..." />}
                    options={{ minimap: { enabled: false } }}
                    value={value || ''}
                    onChange={onChange}
                  />

                  {error && (
                    <Typography variant="caption" color="error">
                      {error.message}
                    </Typography>
                  )}
                </Stack>
              )}
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
