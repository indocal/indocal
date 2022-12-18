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

export const FormsScopePermissions: React.FC = () => {
  const { validating, permissions, saving, togglePermission } =
    useUserRolePermissionsManagementPanel();

  const formItems = useMemo(
    () => [
      {
        label: 'Contar',
        action: 'count',
        checked: Boolean(permissions?.form?.count),
      },
      {
        label: 'Leer',
        action: 'read',
        checked: Boolean(permissions?.form?.read),
      },
      {
        label: 'Crear',
        action: 'create',
        checked: Boolean(permissions?.form?.create),
      },
      {
        label: 'Modificar',
        action: 'update',
        checked: Boolean(permissions?.form?.update),
      },
      {
        label: 'Borrar',
        action: 'delete',
        checked: Boolean(permissions?.form?.delete),
      },
    ],
    [permissions?.form]
  );

  const formFieldItems = useMemo(
    () => [
      {
        label: 'Contar',
        action: 'count',
        checked: Boolean(permissions?.formField?.count),
      },
      {
        label: 'Leer',
        action: 'read',
        checked: Boolean(permissions?.formField?.read),
      },
      {
        label: 'Crear',
        action: 'create',
        checked: Boolean(permissions?.formField?.create),
      },
      {
        label: 'Modificar',
        action: 'update',
        checked: Boolean(permissions?.formField?.update),
      },
      {
        label: 'Borrar',
        action: 'delete',
        checked: Boolean(permissions?.formField?.delete),
      },
    ],
    [permissions?.formField]
  );

  const formEntryItems = useMemo(
    () => [
      {
        label: 'Contar',
        action: 'count',
        checked: Boolean(permissions?.formEntry?.count),
      },
      {
        label: 'Leer',
        action: 'read',
        checked: Boolean(permissions?.formEntry?.read),
      },
      {
        label: 'Crear',
        action: 'create',
        checked: Boolean(permissions?.formEntry?.create),
      },
      {
        label: 'Modificar',
        action: 'update',
        checked: Boolean(permissions?.formEntry?.update),
      },
      {
        label: 'Borrar',
        action: 'delete',
        checked: Boolean(permissions?.formEntry?.delete),
      },
    ],
    [permissions?.formEntry]
  );

  const allChecked =
    formItems.every((item) => item.checked) &&
    formFieldItems.every((item) => item.checked) &&
    formEntryItems.every((item) => item.checked);

  const toggleAll = useCallback(() => {
    if (allChecked) {
      formItems.forEach(({ action }) => togglePermission('form', action));

      formFieldItems.forEach(({ action }) =>
        togglePermission('formField', action)
      );

      formEntryItems.forEach(({ action }) =>
        togglePermission('formEntry', action)
      );
    } else {
      formItems
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('form', action));

      formFieldItems
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('formField', action));

      formEntryItems
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('formEntry', action));
    }
  }, [formItems, formFieldItems, formEntryItems, allChecked, togglePermission]);

  return (
    <Can I="update" an="userRole" passThrough>
      {(allowed) => (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bolder" color="text.secondary">
              Formularios
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
                [ form / formField / formEntry ]
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
                    form
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
                  {formItems.map(({ label, action, checked }) => (
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
                            onChange={() => togglePermission('form', action)}
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
                    formField
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
                  {formFieldItems.map(({ label, action, checked }) => (
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
                              togglePermission('formField', action)
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
                    formEntry
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
                  {formEntryItems.map(({ label, action, checked }) => (
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
                              togglePermission('formEntry', action)
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

export default FormsScopePermissions;
