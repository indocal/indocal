import { forwardRef, RefCallback } from 'react';
import {
  TextField,
  TextFieldProps,
  InputBaseComponentProps,
} from '@mui/material';
import { Controller, ControllerProps, Control } from 'react-hook-form';
import { IMaskInput, IMask } from 'react-imask';

const DniMask = forwardRef<HTMLElement, { onChange: (value: unknown) => void }>(
  function DniMask({ onChange, ...rest }, ref) {
    return (
      <IMaskInput
        {...rest}
        overwrite
        mask="###-#######-#"
        definitions={{ '#': /[0-9]/ }}
        onAccept={(value) => onChange(value)}
        inputRef={ref as RefCallback<IMask.MaskElement>}
      />
    );
  }
);

export interface ControlledDniTextFieldProps {
  name: string;
  label: string;
  control: Control;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  textFieldProps?: Omit<
    TextFieldProps,
    'label' | 'value' | 'onChange' | 'error' | 'helperText' | 'InputProps'
  >;
}

export const ControlledDniTextField: React.FC<ControlledDniTextFieldProps> = ({
  name,
  label,
  control,
  controllerProps,
  textFieldProps,
}) => {
  return (
    <Controller
      {...controllerProps}
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
            inputComponent:
              DniMask as React.ElementType<InputBaseComponentProps>,
          }}
        />
      )}
    />
  );
};

export default ControlledDniTextField;

////////////////
// Re-exports //
////////////////

export { formatDni } from './utils';
