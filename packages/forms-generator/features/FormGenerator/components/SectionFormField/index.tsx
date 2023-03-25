import { useMemo, createElement } from 'react';
import { Stack, Typography, Badge } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { NoData } from '@indocal/ui';
import { Form, SectionFormFieldConfig } from '@indocal/services';

import {
  TextItem,
  TextAreaItem,
  NumberItem,
  DniItem,
  PhoneItem,
  EmailItem,
  CheckboxItem,
  SelectItem,
  RadioItem,
  TimeItem,
  DateItem,
  DateTimeItem,
  FilesItem,
  UsersItem,
} from './components';

export interface SectionFormFieldProps {
  field: Form['fields'][number];
}

export const SectionFormField: React.FC<SectionFormFieldProps> = ({
  field,
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  const config = useMemo<SectionFormFieldConfig | null>(
    () => field.config as SectionFormFieldConfig,
    [field.config]
  );

  const items = useMemo(
    () => ({
      TEXT: TextItem,
      TEXTAREA: TextAreaItem,
      NUMBER: NumberItem,

      DNI: DniItem,
      PHONE: PhoneItem,
      EMAIL: EmailItem,

      CHECKBOX: CheckboxItem,
      SELECT: SelectItem,
      RADIO: RadioItem,

      TIME: TimeItem,
      DATE: DateItem,
      DATETIME: DateTimeItem,

      FILES: FilesItem,

      USERS: UsersItem,
    }),
    []
  );

  return (
    <Stack
      component="fieldset"
      spacing={2}
      sx={{
        margin: 0,
        borderRadius: (theme) => theme.spacing(0.5),
        borderColor: (theme) =>
          errors[field.id] ? theme.palette.error.main : theme.palette.divider,
      }}
    >
      <Badge
        component="legend"
        badgeContent="*"
        invisible={!config?.required}
        slotProps={{ badge: { style: { top: 7.5, right: 5 } } }}
        sx={{
          ...(errors[field.id] && {
            color: (theme) => theme.palette.error.main,
          }),
        }}
      >
        <Typography
          fontWeight="bolder"
          sx={{ marginX: (theme) => theme.spacing(1) }}
        >
          {field.title}
        </Typography>
      </Badge>

      <Stack
        spacing={2}
        sx={{ marginTop: (theme) => `${theme.spacing(0.75)} !important` }}
      >
        {config && config.items && config.items.length > 0 ? (
          config.items.map((item) =>
            createElement(items[item.type], {
              key: item.title,
              field,
              item,
            })
          )
        ) : (
          <NoData message="Esta sección no contiene campos definidos" />
        )}
      </Stack>

      {field.description && (
        <Typography
          component="pre"
          variant="caption"
          color="text.secondary"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            ...(errors[field.id] && {
              color: (theme) => theme.palette.error.main,
            }),
          }}
        >
          {field.description}
        </Typography>
      )}
    </Stack>
  );
};

export default SectionFormField;
