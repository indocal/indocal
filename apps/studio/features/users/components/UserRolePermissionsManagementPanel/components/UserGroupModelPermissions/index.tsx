import { useMemo, useCallback } from 'react';
import {
  Box,
  Grid,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

import { useUserRolePermissionsManagementPanel } from '../../context';

export const UserGroupModelPermissions: React.FC = () => {
  const { validating, permissions, saving, togglePermission } =
    useUserRolePermissionsManagementPanel();

  const items = useMemo(
    () => [
      {
        label: 'Contar',
        action: 'count',
        checked: Boolean(permissions?.userGroup?.count),
      },
      {
        label: 'Leer',
        action: 'read',
        checked: Boolean(permissions?.userGroup?.read),
      },
      {
        label: 'Crear',
        action: 'create',
        checked: Boolean(permissions?.userGroup?.create),
      },
      {
        label: 'Modificar',
        action: 'update',
        checked: Boolean(permissions?.userGroup?.update),
      },
      {
        label: 'Borrar',
        action: 'delete',
        checked: Boolean(permissions?.userGroup?.delete),
      },
    ],
    [permissions?.userGroup]
  );

  const allChecked = items.every((item) => item.checked);

  const toggleAll = useCallback(() => {
    if (allChecked) {
      items.forEach(({ action }) => togglePermission('userGroup', action));
    } else {
      items
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('userGroup', action));
    }
  }, [items, allChecked, togglePermission]);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bolder" color="text.secondary">
          Grupos
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Typography variant="caption" color="text.secondary">
            userGroup
          </Typography>

          <Box
            sx={{
              flex: 1,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />

          <Checkbox
            disabled={validating || saving}
            checked={allChecked}
            onChange={toggleAll}
          />
        </Stack>

        <Grid container justifyContent="center" alignItems="center" spacing={1}>
          {items.map(({ label, action, checked }) => (
            <Grid
              key={action}
              item
              container
              justifyContent="flex-start"
              alignItems="center"
              xs
            >
              <FormControlLabel
                label={label}
                control={
                  <Checkbox
                    disabled={validating || saving}
                    checked={checked}
                    onChange={() => togglePermission('userGroup', action)}
                  />
                }
              />
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default UserGroupModelPermissions;
