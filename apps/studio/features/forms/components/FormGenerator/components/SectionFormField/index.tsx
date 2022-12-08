import { Fragment, useMemo } from 'react';
import { Stack, Typography, Badge } from '@mui/material';
import { useFormContext } from 'react-hook-form';

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
        componentsProps={{ badge: { style: { top: 5, right: 5 } } }}
        sx={{
          ...(errors[field.id] && {
            color: (theme) => theme.palette.error.main,
          }),
        }}
      >
        <Typography sx={{ marginX: (theme) => theme.spacing(0.75) }}>
          {field.title}
        </Typography>
      </Badge>

      {config?.items?.map((item) => (
        <Fragment key={item.title}>
          {items[item.type]({ field, item })}
        </Fragment>
      ))}

      {field.description && (
        <Typography
          variant="caption"
          sx={{
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
