import { forwardRef, RefCallback } from 'react';
import {
  TextField,
  TextFieldProps,
  InputBaseComponentProps,
} from '@mui/material';
import { Controller, ControllerProps, Control } from 'react-hook-form';
import { IMaskInput, IMask } from 'react-imask';

const PhoneTextMask = forwardRef<
  HTMLElement,
  { onChange: (value: unknown) => void }
>(function DniMask({ onChange, ...rest }, ref) {
  return (
    <IMaskInput
      {...rest}
      overwrite
      mask="(###) ###-####"
      definitions={{ '#': /[0-9]/ }}
      onAccept={(value) => onChange(value)}
      inputRef={ref as RefCallback<IMask.MaskElement>}
    />
  );
});

export interface ControlledPhoneTextFieldProps {
  name: string;
  label: string;
  control: Control;
  controllerProps?: Omit<ControllerProps, 'name' | 'render'>;
  textFieldProps?: TextFieldProps;
}

export const ControlledPhoneTextField: React.FC<
  ControlledPhoneTextFieldProps
> = ({ name, label, control, controllerProps, textFieldProps }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <TextField
          {...textFieldProps}
          label={label}
          value={value}
          onChange={onChange}
          error={Boolean(error)}
          helperText={error?.message}
          InputProps={{
            ...textFieldProps?.InputProps,
            inputComponent:
              PhoneTextMask as React.ElementType<InputBaseComponentProps>,
          }}
        />
      )}
      {...controllerProps}
    />
  );
};

export default ControlledPhoneTextField;

////////////////
// Re-exports //
////////////////

export { formatPhone } from './utils';
