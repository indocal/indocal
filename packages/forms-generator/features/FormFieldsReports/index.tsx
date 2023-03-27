import { useMemo, createElement } from 'react';
import { Stack, Divider } from '@mui/material';

import { FormFieldReport } from '@indocal/services';

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
  FilesReport,
  UsersReport,
} from './components';

export interface FormFieldsReportsProps {
  reports: FormFieldReport[];
}

export const FormFieldsReports: React.FC<FormFieldsReportsProps> = ({
  reports,
}) => {
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

      FILES: FilesReport,

      USERS: UsersReport,

      SECTION: () => <></>,
      TABLE: () => <></>,
    }),
    []
  );

  return (
    <Stack spacing={1} divider={<Divider flexItem />}>
      {reports.map((report) =>
        createElement(summaries[report.field.type], {
          key: report.field.id,
          report,
        })
      )}
    </Stack>
  );
};

export default FormFieldsReports;