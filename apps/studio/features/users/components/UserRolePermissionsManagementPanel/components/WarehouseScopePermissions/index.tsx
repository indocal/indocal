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

  const orderItems = useMemo(
    () => [
      {
        label: 'Contar',
        action: 'count',
        checked: Boolean(permissions?.order?.count),
      },
      {
        label: 'Leer',
        action: 'read',
        checked: Boolean(permissions?.order?.read),
      },
      {
        label: 'Crear',
        action: 'create',
        checked: Boolean(permissions?.order?.create),
      },
      {
        label: 'Modificar',
        action: 'update',
        checked: Boolean(permissions?.order?.update),
      },
      {
        label: 'Borrar',
        action: 'delete',
        checked: Boolean(permissions?.order?.delete),
      },
    ],
    [permissions?.order]
  );

  const orderItemItems = useMemo(
    () => [
      {
        label: 'Contar',
        action: 'count',
        checked: Boolean(permissions?.orderItem?.count),
      },
      {
        label: 'Leer',
        action: 'read',
        checked: Boolean(permissions?.orderItem?.read),
      },
      {
        label: 'Crear',
        action: 'create',
        checked: Boolean(permissions?.orderItem?.create),
      },
      {
        label: 'Modificar',
        action: 'update',
        checked: Boolean(permissions?.orderItem?.update),
      },
      {
        label: 'Borrar',
        action: 'delete',
        checked: Boolean(permissions?.orderItem?.delete),
      },
    ],
    [permissions?.orderItem]
  );

  const inventoryMovementItems = useMemo(
    () => [
      {
        label: 'Contar',
        action: 'count',
        checked: Boolean(permissions?.inventoryMovement?.count),
      },
      {
        label: 'Leer',
        action: 'read',
        checked: Boolean(permissions?.inventoryMovement?.read),
      },
      {
        label: 'Crear',
        action: 'create',
        checked: Boolean(permissions?.inventoryMovement?.create),
      },
      {
        label: 'Modificar',
        action: 'update',
        checked: Boolean(permissions?.inventoryMovement?.update),
      },
      {
        label: 'Borrar',
        action: 'delete',
        checked: Boolean(permissions?.inventoryMovement?.delete),
      },
    ],
    [permissions?.inventoryMovement]
  );

  const inventoryMovementItemItems = useMemo(
    () => [
      {
        label: 'Contar',
        action: 'count',
        checked: Boolean(permissions?.inventoryMovementItem?.count),
      },
      {
        label: 'Leer',
        action: 'read',
        checked: Boolean(permissions?.inventoryMovementItem?.read),
      },
      {
        label: 'Crear',
        action: 'create',
        checked: Boolean(permissions?.inventoryMovementItem?.create),
      },
      {
        label: 'Modificar',
        action: 'update',
        checked: Boolean(permissions?.inventoryMovementItem?.update),
      },
      {
        label: 'Borrar',
        action: 'delete',
        checked: Boolean(permissions?.inventoryMovementItem?.delete),
      },
    ],
    [permissions?.inventoryMovementItem]
  );

  const allChecked =
    supplyItems.every((item) => item.checked) &&
    supplierItems.every((item) => item.checked) &&
    orderItems.every((item) => item.checked) &&
    orderItemItems.every((item) => item.checked) &&
    inventoryMovementItems.every((item) => item.checked) &&
    inventoryMovementItemItems.every((item) => item.checked);

  const toggleAll = useCallback(() => {
    if (allChecked) {
      supplyItems.forEach(({ action }) => togglePermission('supply', action));

      supplierItems.forEach(({ action }) =>
        togglePermission('supplier', action)
      );

      orderItems.forEach(({ action }) => togglePermission('order', action));

      orderItemItems.forEach(({ action }) =>
        togglePermission('orderItem', action)
      );

      inventoryMovementItems.forEach(({ action }) =>
        togglePermission('inventoryMovement', action)
      );

      inventoryMovementItemItems.forEach(({ action }) =>
        togglePermission('inventoryMovementItem', action)
      );
    } else {
      supplyItems
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('supply', action));

      supplierItems
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('supplier', action));

      orderItems
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('order', action));

      orderItemItems
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('orderItem', action));

      inventoryMovementItems
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('inventoryMovement', action));

      inventoryMovementItemItems
        .filter(({ checked }) => !checked)
        .forEach(({ action }) =>
          togglePermission('inventoryMovementItem', action)
        );
    }
  }, [
    supplyItems,
    supplierItems,
    orderItems,
    orderItemItems,
    inventoryMovementItems,
    inventoryMovementItemItems,
    allChecked,
    togglePermission,
  ]);

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
                [ supply / supplier / order / orderItem / inventoryMovement /
                inventoryMovementItem ]
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

              <Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography variant="caption" color="text.secondary">
                    order
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
                  {orderItems.map(({ label, action, checked }) => (
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
                            onChange={() => togglePermission('order', action)}
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
                    orderItem
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
                  {orderItemItems.map(({ label, action, checked }) => (
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
                              togglePermission('orderItem', action)
                            }
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
                    inventoryMovement
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
                  {inventoryMovementItems.map(({ label, action, checked }) => (
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
                              togglePermission('inventoryMovement', action)
                            }
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
                    inventoryMovementItem
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
                  {inventoryMovementItemItems.map(
                    ({ label, action, checked }) => (
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
                                togglePermission(
                                  'inventoryMovementItem',
                                  action
                                )
                              }
                            />
                          }
                        />
                      </Grid>
                    )
                  )}
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
