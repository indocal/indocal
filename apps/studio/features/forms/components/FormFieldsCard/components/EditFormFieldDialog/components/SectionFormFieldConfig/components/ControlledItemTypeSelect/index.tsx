import { useMemo } from 'react';
import {
  MenuItem,
  FormControlProps,
  FormHelperTextProps,
  InputLabelProps,
  SelectProps,
} from '@mui/material';
import { Control, ControllerProps } from 'react-hook-form';

import { ControlledSelect } from '@indocal/ui';
import {
  translateFormFieldType,
  SectionFormFieldItemType,
} from '@indocal/services';

export interface ControlledItemTypeSelectProps {
  name: string;
  label?: string;
  control: Control;
  disabled?: boolean;
  required?: boolean;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  formControlProps?: Omit<FormControlProps, 'required' | 'disabled' | 'error'>;
  formHelperTextProps?: FormHelperTextProps;
  inputLabelProps?: InputLabelProps;
  selectProps?: Omit<SelectProps, 'label' | 'value' | 'onChange'>;
}

export const ControlledItemTypeSelect: React.FC<
  ControlledItemTypeSelectProps
> = ({
  name,
  label,
  control,
  disabled,
  required,
  controllerProps,
  formControlProps,
  formHelperTextProps,
  inputLabelProps,
  selectProps,
}) => {
  const status = useMemo<SectionFormFieldItemType[]>(
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
      controllerProps={controllerProps}
      formControlProps={{ required, disabled, ...formControlProps }}
      formHelperTextProps={formHelperTextProps}
      inputLabelProps={inputLabelProps}
      selectProps={selectProps}
    >
      {status.map((status) => (
        <MenuItem key={status} value={status}>
          {translateFormFieldType(status)}
        </MenuItem>
      ))}
    </ControlledSelect>
  );
};

export default ControlledItemTypeSelect;
