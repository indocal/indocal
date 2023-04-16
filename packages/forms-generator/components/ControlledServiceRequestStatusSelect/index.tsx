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
  ServiceRequestStatus,
  translateServiceRequestStatus,
} from '@indocal/services';

export interface ControlledServiceRequestStatusSelect {
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

export const ControlledServiceRequestStatusSelect: React.FC<
  ControlledServiceRequestStatusSelect
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
  const status = useMemo<ServiceRequestStatus[]>(
    () => [
      'PENDING',
      'PENDING_APPROVAL',
      'PENDING_PAYMENT',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELED',
    ],
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
          {translateServiceRequestStatus(status)}
        </MenuItem>
      ))}
    </ControlledSelect>
  );
};

export default ControlledServiceRequestStatusSelect;
