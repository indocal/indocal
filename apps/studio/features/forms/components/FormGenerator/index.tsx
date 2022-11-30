import { Fragment, useMemo, useCallback } from 'react';
import { Paper, Stack, Divider, Typography, Button } from '@mui/material';
import {
  Save as SaveIcon,
  CheckCircle as CheckIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useFormContext } from 'react-hook-form';

import { NoData } from '@indocal/ui';
import { Form } from '@indocal/services';

import { FormGeneratorProvider } from './context';
import {
  TextFormField,
  TextAreaFormField,
  NumberFormField,
  DniFormField,
  PhoneFormField,
  EmailFormField,
  CheckboxFormField,
  SelectFormField,
  RadioFormField,
  TimeFormField,
  DateFormField,
  DateTimeFormField,
  UsersFormField,
  TableFormField,
} from './components';
import { FormFieldAnswer } from './types';

export interface FormGeneratorProps {
  form: Form;
  onSubmit: (answers: FormFieldAnswer[]) => void | Promise<void>;
}

const FormGenerator: React.FC<FormGeneratorProps> = ({ form, onSubmit }) => {
  const {
    formState: { isSubmitting, isSubmitSuccessful },
    handleSubmit,
    reset,
  } = useFormContext();

  const fields = useMemo(
    () => ({
      TEXT: TextFormField,
      TEXTAREA: TextAreaFormField,
      NUMBER: NumberFormField,

      DNI: DniFormField,
      PHONE: PhoneFormField,
      EMAIL: EmailFormField,

      CHECKBOX: CheckboxFormField,
      SELECT: SelectFormField,
      RADIO: RadioFormField,

      TIME: TimeFormField,
      DATE: DateFormField,
      DATETIME: DateTimeFormField,

      USERS: UsersFormField,

      TABLE: TableFormField,
    }),
    []
  );

  const handleOnSubmit = useCallback(
    async (formData: Record<string, FormFieldAnswer['content']>) =>
      await onSubmit(
        form.fields.map((field) => ({
          field,
          content: formData[field.id] || null,
        }))
      ),
    [form.fields, onSubmit]
  );

  return (
    <Paper sx={{ padding: (theme) => theme.spacing(2) }}>
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{
          display: isSubmitSuccessful ? 'flex' : 'none',
          margin: 'auto',
          padding: (theme) => theme.spacing(2),
        }}
      >
        <CheckIcon fontSize="large" color="success" />

        <Typography variant="h5" align="center" sx={{ fontWeight: 'bolder' }}>
          Respuestas recibidas
        </Typography>

        <Typography variant="caption" align="center" color="text.secondary">
          Hemos recibido sus respuestas, estaremos trabajando para brindarle la
          mejor experiencia
        </Typography>

        <Button
          variant="contained"
          size="small"
          endIcon={<ResetIcon />}
          onClick={() => reset()}
          sx={{ marginTop: (theme) => theme.spacing(1.5) }}
        >
          Enviar otra respuesta
        </Button>
      </Stack>

      <Stack
        spacing={1}
        divider={<Divider flexItem />}
        sx={{ display: isSubmitSuccessful ? 'none' : 'flex' }}
      >
        <Stack>
          <Typography variant="h5" align="center" fontWeight="bolder">
            {form.title}
          </Typography>

          {form.description && (
            <Typography variant="caption" align="center">
              {form.description}
            </Typography>
          )}
        </Stack>

        {form.fields.length > 0 ? (
          <Stack
            component="form"
            noValidate
            spacing={2}
            onSubmit={handleSubmit(handleOnSubmit)}
            sx={{ padding: (theme) => theme.spacing(1) }}
          >
            {form.fields.map((field) => (
              <Fragment key={field.id}>
                {fields[field.type]({ field })}
              </Fragment>
            ))}

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              endIcon={<SaveIcon />}
            >
              Guardar respuestas
            </LoadingButton>
          </Stack>
        ) : (
          <NoData message="Este formulario no contiene campos" />
        )}
      </Stack>
    </Paper>
  );
};

const FormGeneratorWrapper: React.FC<FormGeneratorProps> = (props) => (
  <FormGeneratorProvider>
    <FormGenerator {...props} />
  </FormGeneratorProvider>
);

export { FormGeneratorWrapper as FormGenerator };

export default FormGeneratorWrapper;

////////////////
// Re-exports //
////////////////

export * from './types';
