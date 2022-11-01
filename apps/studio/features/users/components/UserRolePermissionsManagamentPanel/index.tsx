import {
  Paper,
  Stack,
  Typography,
  Button,
  LinearProgress,
} from '@mui/material';
import { CloudSync as SaveIcon } from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { UUID, UserRole } from '@indocal/services';

import {
  UserRolePermissionsManagamentPanelProvider,
  useUserRolePermissionsManagamentPanel,
} from './context';
import { UserRolePermissionsManagamentPanelModelPermissions } from './components';
import { useUserRolePermissionsByRole } from './hooks';

const UserRolePermissionsManagamentPanel: React.FC = () => {
  const { saving, role, permissions, save } =
    useUserRolePermissionsManagamentPanel();

  const { loading, validating, error } = useUserRolePermissionsByRole(role);

  return (
    <Paper sx={{ display: 'grid' }}>
      {loading ? (
        <Loader invisible message="Cargando permisos..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : permissions ? (
        <Stack
          sx={{ position: 'relative', padding: (theme) => theme.spacing(1, 2) }}
        >
          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            sx={{
              padding: (theme) => theme.spacing(1),
              borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Permisos
            </Typography>

            <Button
              size="small"
              variant="contained"
              color="secondary"
              disabled={validating || saving}
              endIcon={<SaveIcon />}
              onClick={save}
            >
              Guardar
            </Button>
          </Stack>

          <Stack sx={{ padding: (theme) => theme.spacing(1) }}>
            {Object.entries(permissions).map(([model, permissions]) => (
              <UserRolePermissionsManagamentPanelModelPermissions
                key={model}
                model={model}
                permissions={permissions}
              />
            ))}
          </Stack>
        </Stack>
      ) : (
        <NoData message="Sin permisos a mostrar" />
      )}
    </Paper>
  );
};

interface UserRolePermissionsManagamentPanelWrapperProps {
  role: UUID | UserRole;
}

const UserRolePermissionsManagamentPanelWrapper: React.FC<
  UserRolePermissionsManagamentPanelWrapperProps
> = ({ role }) => (
  <UserRolePermissionsManagamentPanelProvider role={role}>
    <UserRolePermissionsManagamentPanel />
  </UserRolePermissionsManagamentPanelProvider>
);

export { UserRolePermissionsManagamentPanelWrapper as UserRolePermissionsManagamentPanel };
export type { UserRolePermissionsManagamentPanelWrapperProps as UserRolePermissionsManagamentPanelProps };

export default UserRolePermissionsManagamentPanel;
