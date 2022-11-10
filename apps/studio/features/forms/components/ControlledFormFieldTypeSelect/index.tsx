import { useMemo } from 'react';
import { MenuItem } from '@mui/material';
import { Control } from 'react-hook-form';

import { ControlledSelect } from '@indocal/ui';
import { FormFieldType, translateFormFieldType } from '@indocal/services';

export interface ControlledFormFieldTypeSelectProps {
  name: string;
  label: string;
  control: Control;
  disabled?: boolean;
  required?: boolean;
}

export const ControlledFormFieldTypeSelect: React.FC<
  ControlledFormFieldTypeSelectProps
> = ({ name, label, control, disabled, required }) => {
  const status = useMemo<FormFieldType[]>(
    () => [
      'TEXT',
      'TEXTAREA',
      'NUMBER',

      'DNI',
      'PHONE',
      'EMAIL',

      'CHECKBOX',
      'SELECT',
      'RADIO',

      'TIME',
      'DATE',
      'DATETIME',

      'USERS',
    ],
    []
  );

  return (
    <ControlledSelect
      name={name}
      label={label}
      control={control}
      formControlProps={{ required, disabled }}
    >
      {status.map((status) => (
        <MenuItem key={status} value={status}>
          {translateFormFieldType(status)}
        </MenuItem>
      ))}
    </ControlledSelect>
  );
};

export default ControlledFormFieldTypeSelect;
