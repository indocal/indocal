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

export const WarehouseScopePermissions: React.FC = () => {
  const { validating, permissions, saving, togglePermission } =
    useUserRolePermissionsManagementPanel();

  const supplyItems = useMemo(
    () => [
      {
        label: 'Contar',
        action: 'count',
        checked: Boolean(permissions?.supply?.count),
      },
      {
        label: 'Leer',
        action: 'read',
        checked: Boolean(permissions?.supply?.read),
      },
      {
        label: 'Crear',
        action: 'create',
        checked: Boolean(permissions?.supply?.create),
      },
      {
        label: 'Modificar',
        action: 'update',
        checked: Boolean(permissions?.supply?.update),
      },
      {
        label: 'Borrar',
        action: 'delete',
        checked: Boolean(permissions?.supply?.delete),
      },
    ],
    [permissions?.supply]
  );

  const supplierItems = useMemo(
    () => [
      {
        label: 'Contar',
        action: 'count',
        checked: Boolean(permissions?.supplier?.count),
      },
      {
        label: 'Leer',
        action: 'read',
        checked: Boolean(permissions?.supplier?.read),
      },
      {
        label: 'Crear',
        action: 'create',
        checked: Boolean(permissions?.supplier?.create),
      },
      {
        label: 'Modificar',
        action: 'update',
        checked: Boolean(permissions?.supplier?.update),
      },
      {
        label: 'Borrar',
        action: 'delete',
        checked: Boolean(permissions?.supplier?.delete),
      },
    ],
    [permissions?.supplier]
  );

  const allChecked =
    supplyItems.every((item) => item.checked) &&
    supplierItems.every((item) => item.checked);

  const toggleAll = useCallback(() => {
    if (allChecked) {
      supplyItems.forEach(({ action }) => togglePermission('supply', action));

      supplierItems.forEach(({ action }) =>
        togglePermission('supplier', action)
      );
    } else {
      supplyItems
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('supply', action));

      supplierItems
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('supplier', action));
    }
  }, [supplyItems, supplierItems, allChecked, togglePermission]);

  return (
    <Can I="update" an="userRole" passThrough>
      {(allowed) => (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bolder" color="text.secondary">
              Almacén & Suministro
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
                [ supply / supplier ]
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

            <Stack spacing={2}>
              <Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography variant="caption" color="text.secondary">
                    supply
                  </Typography>

                  <Box
                    sx={{
                      flex: 1,
                      borderBottom: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                    }}
                  />
                </Stack>

                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                >
                  {supplyItems.map(({ label, action, checked }) => (
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
                            onChange={() => togglePermission('supply', action)}
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
                    supplier
                  </Typography>

                  <Box
                    sx={{
                      flex: 1,
                      borderBottom: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                    }}
                  />
                </Stack>

                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                >
                  {supplierItems.map(({ label, action, checked }) => (
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
                            onChange={() =>
                              togglePermission('supplier', action)
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
      )}
    </Can>
  );
};

export default WarehouseScopePermissions;
