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

export const EventModelPermissions: React.FC = () => {
  const { validating, permissions, saving, togglePermission } =
    useUserRolePermissionsManagementPanel();

  const eventItems = useMemo(
    () => [
      {
        label: 'Contar',
        action: 'count',
        checked: Boolean(permissions?.event?.count),
      },
      {
        label: 'Leer',
        action: 'read',
        checked: Boolean(permissions?.event?.read),
      },
      {
        label: 'Crear',
        action: 'create',
        checked: Boolean(permissions?.event?.create),
      },
      {
        label: 'Modificar',
        action: 'update',
        checked: Boolean(permissions?.event?.update),
      },
      {
        label: 'Borrar',
        action: 'delete',
        checked: Boolean(permissions?.event?.delete),
      },
    ],
    [permissions?.event]
  );

  const eventGuestItems = useMemo(
    () => [
      {
        label: 'Contar',
        action: 'count',
        checked: Boolean(permissions?.eventGuest?.count),
      },
      {
        label: 'Leer',
        action: 'read',
        checked: Boolean(permissions?.eventGuest?.read),
      },
      {
        label: 'Crear',
        action: 'create',
        checked: Boolean(permissions?.eventGuest?.create),
      },
      {
        label: 'Modificar',
        action: 'update',
        checked: Boolean(permissions?.eventGuest?.update),
      },
      {
        label: 'Borrar',
        action: 'delete',
        checked: Boolean(permissions?.eventGuest?.delete),
      },
    ],
    [permissions?.eventGuest]
  );

  const allChecked =
    eventItems.every((item) => item.checked) &&
    eventGuestItems.every((item) => item.checked);

  const toggleAll = useCallback(() => {
    if (allChecked) {
      eventItems.forEach(({ action }) => togglePermission('event', action));

      eventGuestItems.forEach(({ action }) =>
        togglePermission('eventGuest', action)
      );
    } else {
      eventItems
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('event', action));

      eventGuestItems
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('eventGuest', action));
    }
  }, [eventItems, eventGuestItems, allChecked, togglePermission]);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color="text.secondary" sx={{ fontWeight: 'bold' }}>
          Eventos
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
            [ event / eventGuest ]
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
                event
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
              {eventItems.map(({ label, action, checked }) => (
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
                        onChange={() => togglePermission('event', action)}
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
                eventGuest
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
              {eventGuestItems.map(({ label, action, checked }) => (
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
                        onChange={() => togglePermission('eventGuest', action)}
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

export default EventModelPermissions;
