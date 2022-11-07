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

export const UserGroupModelPermissions: React.FC = () => {
  const { validating, permissions } = useUserRolePermissionsManagamentPanel();

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color="text.secondary" sx={{ fontWeight: 'bold' }}>
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

          <Checkbox disabled={validating} />
        </Stack>

        <Grid container justifyContent="center" alignItems="center" spacing={1}>
          <Grid
            item
            container
            justifyContent="flex-start"
            alignItems="center"
            xs
          >
            <FormControlLabel
              label="Contar"
              control={
                <Checkbox
                  disabled={validating}
                  defaultChecked={permissions?.userGroup.count}
                />
              }
            />
          </Grid>

          <Grid
            item
            container
            justifyContent="flex-start"
            alignItems="center"
            xs
          >
            <FormControlLabel
              label="Leer"
              control={
                <Checkbox
                  disabled={validating}
                  defaultChecked={permissions?.userGroup.read}
                />
              }
            />
          </Grid>

          <Grid
            item
            container
            justifyContent="flex-start"
            alignItems="center"
            xs
          >
            <FormControlLabel
              label="Crear"
              control={
                <Checkbox
                  disabled={validating}
                  defaultChecked={permissions?.userGroup.create}
                />
              }
            />
          </Grid>

          <Grid
            item
            container
            justifyContent="flex-start"
            alignItems="center"
            xs
          >
            <FormControlLabel
              label="Modificar"
              control={
                <Checkbox
                  disabled={validating}
                  defaultChecked={permissions?.userGroup.update}
                />
              }
            />
          </Grid>

          <Grid
            item
            container
            justifyContent="flex-start"
            alignItems="center"
            xs
          >
            <FormControlLabel
              label="Borrar"
              control={
                <Checkbox
                  disabled={validating}
                  defaultChecked={permissions?.userGroup.delete}
                />
              }
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default UserGroupModelPermissions;
