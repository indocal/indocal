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
  InventoryMovementType,
  translateInventoryMovementType,
} from '@indocal/services';

export interface ControlledMovementTypeSelectProps {
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

export const ControlledMovementTypeSelect: React.FC<
  ControlledMovementTypeSelectProps
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
  const types = useMemo<Exclude<InventoryMovementType, 'INPUT'>[]>(
    () => ['ADJUSTMENT', 'OUTPUT', 'TRANSFER', 'DISCHARGE'],
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
      {types.map((type) => (
        <MenuItem key={type} value={type}>
          {translateInventoryMovementType(type)}
        </MenuItem>
      ))}
    </ControlledSelect>
  );
};

export default ControlledMovementTypeSelect;
