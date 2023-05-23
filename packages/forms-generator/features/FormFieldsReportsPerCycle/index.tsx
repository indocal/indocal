import { useMemo, createElement } from 'react';
import { Paper, Stack, Divider, Button, LinearProgress } from '@mui/material';
import { DownloadForOffline as ExportIcon } from '@mui/icons-material';
import { useForm, Control } from 'react-hook-form';

import { Loader, NoData, ErrorInfo, ControlledDatePicker } from '@indocal/ui';
import { INDOCAL, useFormFieldsReports, UUID, Form } from '@indocal/services';

import {
  TextReport,
  TextAreaReport,
  NumberReport,
  DniReport,
  PhoneReport,
  EmailReport,
  CheckboxReport,
  SelectReport,
  RadioReport,
  TimeReport,
  DateReport,
  DateTimeReport,
  RatingReport,
  NetPromoterScoreReport,
  FilesReport,
  UsersReport,
  SectionReport,
  TableReport,
} from './components';

import { useExportFormEntries } from './hooks';

type FormData = {
  year: Date;
};

export interface FormFieldsReportsPerCycleProps {
  form: UUID | Form;
  client: INDOCAL;
}

export const FormFieldsReportsPerCycle: React.FC<
  FormFieldsReportsPerCycleProps
> = ({ form, client }) => {
  const { control, watch } = useForm<FormData>({
    defaultValues: {
      year: new Date(),
    },
  });

  const year = watch('year') || new Date();

  const { loading, validating, reports, error } = useFormFieldsReports(
    typeof form === 'string' ? form : form.id,
    { year }
  );

  const { downloading, download } = useExportFormEntries({ form, client });

  const summaries = useMemo(
    () => ({
      TEXT: TextReport,
      TEXTAREA: TextAreaReport,
      NUMBER: NumberReport,

      DNI: DniReport,
      PHONE: PhoneReport,
      EMAIL: EmailReport,

      CHECKBOX: CheckboxReport,
      SELECT: SelectReport,
      RADIO: RadioReport,

      TIME: TimeReport,
      DATE: DateReport,
      DATETIME: DateTimeReport,

      RATING: RatingReport,
      NET_PROMOTER_SCORE: NetPromoterScoreReport,

      FILES: FilesReport,

      USERS: UsersReport,

      SECTION: SectionReport,
      TABLE: TableReport,
    }),
    []
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
      ) : (
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
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent={{ xs: 'center', md: 'space-between' }}
              alignItems="center"
              spacing={1}
              divider={<Divider flexItem />}
            >
              <Button
                variant="contained"
                disabled={downloading || validating}
                endIcon={<ExportIcon />}
                onClick={() => download(year)}
              >
                Exportar datos
              </Button>

              <ControlledDatePicker
                name="year"
                label="Año"
                control={control as unknown as Control}
                textFieldProps={{ size: 'small' }}
                datePickerProps={{ views: ['year'] }}
              />
            </Stack>

            {reports.length > 0 ? (
              <Stack
                spacing={1}
                divider={<Divider flexItem />}
                sx={{ flex: 1 }}
              >
                {reports.map((report) =>
                  createElement(summaries[report.field.type], {
                    key: report.field.id,
                    report,
                  })
                )}
              </Stack>
            ) : (
              <NoData message="No se han encontrado entradas suficientes para generar reportes" />
            )}
          </Stack>
        </>
      )}
    </Paper>
  );
};

export default FormFieldsReportsPerCycle;
