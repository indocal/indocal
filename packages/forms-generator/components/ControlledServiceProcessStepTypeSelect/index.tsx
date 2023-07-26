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
  ServiceProcessStepType,
  translateServiceProcessStepType,
} from '@indocal/services';

export interface ControlledServiceProcessStepTypeSelect {
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

export const ControlledServiceProcessStepTypeSelect: React.FC<
  ControlledServiceProcessStepTypeSelect
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
  const types = useMemo<ServiceProcessStepType[]>(
    () => ['START', 'DUMMY', 'END'],
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
      {types.map((type) => (
        <MenuItem key={type} value={type}>
          {translateServiceProcessStepType(type)}
        </MenuItem>
      ))}
    </ControlledSelect>
  );
};

export default ControlledServiceProcessStepTypeSelect;
