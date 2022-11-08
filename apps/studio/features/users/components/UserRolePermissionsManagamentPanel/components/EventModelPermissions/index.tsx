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

import { useUserRolePermissionsManagamentPanel } from '../../context';

export const EventModelPermissions: React.FC = () => {
  const { validating, permissions, saving, togglePermission } =
    useUserRolePermissionsManagamentPanel();

  const items = useMemo(
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

  const allChecked = items.every((item) => item.checked);

  const toggleAll = useCallback(() => {
    if (allChecked) {
      items.forEach(({ action }) => togglePermission('event', action));
    } else {
      items
        .filter(({ checked }) => !checked)
        .forEach(({ action }) => togglePermission('event', action));
    }
  }, [items, allChecked, togglePermission]);

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
                    onChange={() => togglePermission('event', action)}
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

export default EventModelPermissions;
