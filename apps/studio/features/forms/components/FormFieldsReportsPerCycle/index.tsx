import { Paper, Box, Stack, Divider, LinearProgress } from '@mui/material';
import { useForm, Control } from 'react-hook-form';

import { Loader, NoData, ErrorInfo, ControlledDatePicker } from '@indocal/ui';
import { FormFieldsReports } from '@indocal/forms-generator';
import { useFormFieldsReports, UUID, Form } from '@indocal/services';

type FormData = {
  year: Date;
};

export interface FormFieldsReportsPerCycleProps {
  form: UUID | Form;
}

export const FormFieldsReportsPerCycle: React.FC<
  FormFieldsReportsPerCycleProps
> = ({ form }) => {
  const { control, watch } = useForm<FormData>({
    defaultValues: {
      year: new Date(),
    },
  });

  const year = watch('year') || new Date();

  const { loading, validating, reports, error } = useFormFieldsReports(
    typeof form === 'string' ? form : form.id,
    {
      year,
    }
  );

  return (
    <Paper
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {loading ? (
        <Loader invisible message="Generando reportes..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : reports.length > 0 ? (
        <>
          {validating && (
            <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: (theme) => theme.zIndex.modal - 1,
                width: '100%',
                borderTopLeftRadius: (theme) => theme.shape.borderRadius,
                borderTopRightRadius: (theme) => theme.shape.borderRadius,
              }}
            />
          )}

          <Stack
            spacing={1}
            divider={<Divider flexItem />}
            sx={{ height: '100%', padding: (theme) => theme.spacing(2) }}
          >
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <ControlledDatePicker
                name="year"
                label="Año"
                control={control as unknown as Control}
                textFieldProps={{ size: 'small' }}
                datePickerProps={{ views: ['year'] }}
              />
            </Stack>

            <Box sx={{ flex: 1 }}>
              <FormFieldsReports reports={reports} />
            </Box>
          </Stack>
        </>
      ) : (
        <NoData message="No se han encontrado entradas suficientes para generar reportes" />
      )}
    </Paper>
  );
};

export default FormFieldsReportsPerCycle;
