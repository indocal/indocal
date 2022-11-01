import { useMemo } from 'react';
import { MenuItem } from '@mui/material';
import { Control } from 'react-hook-form';

import { ControlledSelect } from '@indocal/ui';
import { UserStatus, translateUserStatus } from '@indocal/services';

export interface ControlledUserStatusSelectProps {
  name: string;
  label: string;
  control: Control;
  disabled?: boolean;
  required?: boolean;
}

export const ControlledUserStatusSelect: React.FC<
  ControlledUserStatusSelectProps
> = ({ name, label, control, disabled, required }) => {
  const status = useMemo<UserStatus[]>(() => ['ENABLED', 'DISABLED'], []);

  return (
    <ControlledSelect
      name={name}
      label={label}
      control={control}
      formControlProps={{ required, disabled }}
    >
      {status.map((status) => (
        <MenuItem key={status} value={status}>
          {translateUserStatus(status)}
        </MenuItem>
      ))}
    </ControlledSelect>
  );
};

export default ControlledUserStatusSelect;
