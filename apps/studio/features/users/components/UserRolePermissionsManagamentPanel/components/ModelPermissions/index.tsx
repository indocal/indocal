import { useMemo } from 'react';
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

import { Permissions } from '@indocal/services';

import { useUserRolePermissionsManagamentPanel } from '../../context';
import { translateModel, translatePermissionAction } from '../../utils';

export interface UserRolePermissionsManagamentPanelModelPermissionsProps {
  model: string;
  permissions: Permissions;
}

export const UserRolePermissionsManagamentPanelModelPermissions: React.FC<
  UserRolePermissionsManagamentPanelModelPermissionsProps
> = ({ model, permissions }) => {
  const { saving, toggleAllModelPermissions, togglePermission } =
    useUserRolePermissionsManagamentPanel();

  const areAllModelPermissionsChecked = useMemo(
    () => Object.values(permissions).every((action) => action === true),
    [permissions]
  );

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color="text.secondary" sx={{ fontWeight: 'bold' }}>
          {translateModel(model)}
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
            {model}
          </Typography>

          <Box
            sx={{
              flex: 1,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />

          <Checkbox
            disabled={saving}
            checked={areAllModelPermissionsChecked}
            onChange={() => toggleAllModelPermissions(model)}
          />
        </Stack>

        <Grid container justifyContent="center" alignItems="center" spacing={1}>
          {Object.entries(permissions).map(([action, value]) => (
            <Grid
              key={action}
              item
              container
              justifyContent="flex-start"
              alignItems="center"
              xs
            >
              <FormControlLabel
                label={translatePermissionAction(action)}
                disabled={saving}
                control={
                  <Checkbox
                    checked={value}
                    onChange={() => togglePermission(model, action)}
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

export default UserRolePermissionsManagamentPanelModelPermissions;
