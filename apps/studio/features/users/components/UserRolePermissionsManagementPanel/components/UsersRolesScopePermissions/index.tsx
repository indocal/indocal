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

export const UsersRolesScopePermissions: React.FC = () => {
  const { validating, permissions, saving, togglePermission } =
    useUserRolePermissionsManagementPanel();

  const userRoleItems = useMemo(
    () => [
      {
        label: 'Contar',
        action: 'count',
        checked: Boolean(permissions?.userRole?.count),
      },
      {
        label: 'Leer',
        action: 'read',
        checked: Boolean(permissions?.userRole?.read),
      },
      {
        label: 'Crear',
        action: 'create',
        checked: Boolean(permissions?.userRole?.create),
      },
      {
        label: 'Modificar',
        action: 'update',
        checked: Boolean(permissions?.userRole?.update),
      },
      {
        label: 'Borrar',
        action: 'delete',
        checked: Boolean(permissions?.userRole?.delete),
      },
    ],
    [permissions?.userRole]
  );

  const userRolePermissionItems = useMemo(
    () => [
      {
        label: 'Contar',
        action: 'count',
        checked: Boolean(permissions?.userRolePermission?.count),
      },
      {
        label: 'Leer',
        action: 'read',
        checked: Boolean(permissions?.userRolePermission?.read),
      },
      {
        label: 'Crear',
        action: 'create',
        checked: Boolean(permissions?.userRolePermission?.create),
      },
      {
        label: 'Modificar',
        action: 'update',
        checked: Boolean(permissions?.userRolePermission?.update),
      },
      {
        label: 'Borrar',
        action: 'delete',
        checked: Boolean(permissions?.userRolePermission?.delete),
      },
    ],
    [permissions?.userRolePermission]
  );

  const allChecked =
    userRoleItems.every((item) => item.checked) &&
    userRolePermissionItems.every((item) => item.checked);

  const toggleAll = useCallback(() => {
    if (allChecked) {
      userRoleItems.forEach(({ action }) =>
        togglePermission('userRole', action)
      );

      userRolePermissionItems.forEach(({ action }) =>
        togglePermission('userRolePermission', action)
      );
    } else {
      userRoleItems
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('userRole', action));

      userRolePermissionItems
        .filter(({ checked }) => !checked)
        .forEach(({ action }) =>
          togglePermission('userRolePermission', action)
        );
    }
  }, [userRoleItems, userRolePermissionItems, allChecked, togglePermission]);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bolder" color="text.secondary">
          Roles
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{ marginBottom: (theme) => theme.spacing(1) }}
        >
          <Typography variant="caption" color="text.secondary">
            [ userRole / userRolePermission ]
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

        <Stack spacing={2}>
          <Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              <Typography variant="caption" color="text.secondary">
                userRole
              </Typography>

              <Box
                sx={{
                  flex: 1,
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              />
            </Stack>

            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              {userRoleItems.map(({ label, action, checked }) => (
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
                        onChange={() => togglePermission('userRole', action)}
                      />
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>

          <Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              <Typography variant="caption" color="text.secondary">
                userRolePermission
              </Typography>

              <Box
                sx={{
                  flex: 1,
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              />
            </Stack>

            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              {userRolePermissionItems.map(({ label, action, checked }) => (
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
                        onChange={() =>
                          togglePermission('userRolePermission', action)
                        }
                      />
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default UsersRolesScopePermissions;
