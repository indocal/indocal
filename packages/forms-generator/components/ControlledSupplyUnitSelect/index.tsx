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
import { SupplyUnit, translateSupplyUnit } from '@indocal/services';

export interface ControlledSupplyUnitSelectProps {
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

export const ControlledSupplyUnitSelect: React.FC<
  ControlledSupplyUnitSelectProps
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
  const units = useMemo<SupplyUnit[]>(
    () => ['UNIT', 'PACK', 'BOX', 'BLOCK', 'REAM', 'BALE', 'SACK', 'GALLON'],
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
      {units.map((unit) => (
        <MenuItem key={unit} value={unit}>
          {translateSupplyUnit(unit)}
        </MenuItem>
      ))}
    </ControlledSelect>
  );
};

export default ControlledSupplyUnitSelect;
