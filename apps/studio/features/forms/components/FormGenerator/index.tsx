import { Fragment, useMemo, useCallback } from 'react';
import { Paper, Stack, Divider, Typography } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
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
    formState: { isSubmitting },
    handleSubmit,
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
    async (formData: Record<string, unknown>) => {
      const answers: FormFieldAnswer[] = form.fields.map((field) => ({
        field,
        content: formData[field.id] || null,
      }));

      await onSubmit(answers);
    },
    [form.fields, onSubmit]
  );

  return (
    <Stack
      component={Paper}
      divider={<Divider flexItem />}
      gap={2}
      sx={{ padding: (theme) => theme.spacing(2) }}
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
        >
          {form.fields.map((field) => (
            <Fragment key={field.id}>{fields[field.type]({ field })}</Fragment>
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
