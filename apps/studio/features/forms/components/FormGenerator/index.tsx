import { Fragment, useMemo, useCallback } from 'react';
import { Paper, Stack, Divider, Typography } from '@mui/material';
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
} from './components';

export interface FormGeneratorProps {
  form: Form;
}

const FormGenerator: React.FC<FormGeneratorProps> = ({ form }) => {
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
    }),
    []
  );

  const onSubmit = useCallback(async (data: unknown) => {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(data);
  }, []);

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
          onSubmit={handleSubmit(onSubmit)}
        >
          {form.fields.map((field) => (
            <Fragment key={field.id}>{fields[field.type]({ field })}</Fragment>
          ))}

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Enviar
          </LoadingButton>
        </Stack>
      ) : (
        <NoData message="Este formulario no contiene campos" />
      )}
    </Stack>
  );
};

const FormGeneratorWrapper: React.FC<FormGeneratorProps> = ({ form }) => (
  <FormGeneratorProvider>
    <FormGenerator form={form} />
  </FormGeneratorProvider>
);

export { FormGeneratorWrapper as FormGenerator };

export default FormGeneratorWrapper;
