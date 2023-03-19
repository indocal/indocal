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
import { FormStatus, translateFormStatus } from '@indocal/services';

export interface ControlledFormStatusSelectProps {
  name: string;
  label?: string;
  description?: string | null;
  control: Control;
  disabled?: boolean;
  required?: boolean;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  formControlProps?: Omit<FormControlProps, 'required' | 'disabled' | 'error'>;
  formHelperTextProps?: FormHelperTextProps;
  inputLabelProps?: InputLabelProps;
  selectProps?: Omit<SelectProps, 'label' | 'value' | 'onChange'>;
}

export const ControlledFormStatusSelect: React.FC<
  ControlledFormStatusSelectProps
> = ({
  name,
  label,
  description,
  control,
  disabled,
  required,
  controllerProps,
  formControlProps,
  formHelperTextProps,
  inputLabelProps,
  selectProps,
}) => {
  const status = useMemo<FormStatus[]>(
    () => ['DRAFT', 'PUBLISHED', 'HIDDEN'],
    []
  );

  return (
    <ControlledSelect
      name={name}
      label={label}
      description={description}
      control={control}
      controllerProps={controllerProps}
      formControlProps={{ required, disabled, ...formControlProps }}
      formHelperTextProps={formHelperTextProps}
      inputLabelProps={inputLabelProps}
      selectProps={selectProps}
    >
      {status.map((status) => (
        <MenuItem key={status} value={status}>
          {translateFormStatus(status)}
        </MenuItem>
      ))}
    </ControlledSelect>
  );
};

export default ControlledFormStatusSelect;
