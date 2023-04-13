import { TextField, TextFieldProps } from '@mui/material';

export type NumberFieldProps = Omit<TextFieldProps, 'type'>;

export const NumberField: React.FC<NumberFieldProps> = (props) => (
  <TextField
    {...props}
    type="number"
    inputProps={{
      ...props.inputProps,
      inputMode: 'numeric',
      pattern: '[0-9]*',
    }}
  />
);

export default NumberField;
