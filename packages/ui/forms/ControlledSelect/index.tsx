import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  FormControlProps,
  FormHelperTextProps,
  InputLabelProps,
  SelectProps,
} from '@mui/material';
import { Controller, ControllerProps, Control } from 'react-hook-form';

export interface ControlledSelectProps {
  name: string;
  label?: string;
  description?: string | null;
  control: Control;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  formControlProps?: Omit<FormControlProps, 'error'>;
  formHelperTextProps?: FormHelperTextProps;
  inputLabelProps?: InputLabelProps;
  selectProps?: Omit<SelectProps, 'label' | 'value' | 'onChange'>;
}

export const ControlledSelect: React.FC<
  React.PropsWithChildren<ControlledSelectProps>
> = ({
  name,
  label,
  description,
  control,
  controllerProps,
  formControlProps,
  formHelperTextProps,
  inputLabelProps,
  selectProps,
  children,
}) => (
  <Controller
    {...controllerProps}
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <FormControl {...formControlProps} error={Boolean(error)}>
        {label && <InputLabel {...inputLabelProps}>{label}</InputLabel>}

        <Select
          {...selectProps}
          label={label}
          value={value}
          onChange={(value) => onChange(value)}
        >
          {children}
        </Select>

        {(error?.message || description) && (
          <FormHelperText {...formHelperTextProps}>
            {error?.message || description}
          </FormHelperText>
        )}
      </FormControl>
    )}
  />
);

export default ControlledSelect;
