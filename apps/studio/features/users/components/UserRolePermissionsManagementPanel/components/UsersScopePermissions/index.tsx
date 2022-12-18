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

import { Can } from '@indocal/services';

import { useUserRolePermissionsManagementPanel } from '../../context';

export const UsersScopePermissions: React.FC = () => {
  const { validating, permissions, saving, togglePermission } =
    useUserRolePermissionsManagementPanel();

  const items = useMemo(
    () => [
      {
        label: 'Contar',
        action: 'count',
        checked: Boolean(permissions?.user?.count),
      },
      {
        label: 'Leer',
        action: 'read',
        checked: Boolean(permissions?.user?.read),
      },
      {
        label: 'Crear',
        action: 'create',
        checked: Boolean(permissions?.user?.create),
      },
      {
        label: 'Modificar',
        action: 'update',
        checked: Boolean(permissions?.user?.update),
      },
      {
        label: 'Borrar',
        action: 'delete',
        checked: Boolean(permissions?.user?.delete),
      },
    ],
    [permissions?.user]
  );

  const allChecked = items.every((item) => item.checked);

  const toggleAll = useCallback(() => {
    if (allChecked) {
      items.forEach(({ action }) => togglePermission('user', action));
    } else {
      items
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('user', action));
    }
  }, [items, allChecked, togglePermission]);

  return (
    <Can I="update" an="userRole" passThrough>
      {(allowed) => (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bolder" color="text.secondary">
              Usuarios
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
                user
              </Typography>

              <Box
                sx={{
                  flex: 1,
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              />

              <Checkbox
                disabled={!allowed || validating || saving}
                checked={allChecked}
                onChange={toggleAll}
              />
            </Stack>

            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
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
                        disabled={!allowed || validating || saving}
                        checked={checked}
                        onChange={() => togglePermission('user', action)}
                      />
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </Can>
  );
};

export default UsersScopePermissions;
