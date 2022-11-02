import { useMemo } from 'react';
import { MenuItem } from '@mui/material';
import { Control } from 'react-hook-form';

import { ControlledSelect } from '@indocal/ui';
import { FormVisibility, translateFormVisibility } from '@indocal/services';

export interface ControlledFormVisibilitySelectProps {
  name: string;
  label: string;
  control: Control;
  disabled?: boolean;
  required?: boolean;
}

export const ControlledFormVisibilitySelect: React.FC<
  ControlledFormVisibilitySelectProps
> = ({ name, label, control, disabled, required }) => {
  const status = useMemo<FormVisibility[]>(() => ['PUBLIC', 'PRIVATE'], []);

  return (
    <ControlledSelect
      name={name}
      label={label}
      control={control}
      formControlProps={{ required, disabled }}
    >
      {status.map((status) => (
        <MenuItem key={status} value={status}>
          {translateFormVisibility(status)}
        </MenuItem>
      ))}
    </ControlledSelect>
  );
};

export default ControlledFormVisibilitySelect;
