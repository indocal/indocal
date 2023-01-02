import {
  Paper,
  Stack,
  Typography,
  Button,
  LinearProgress,
} from '@mui/material';
import { CloudSync as SaveIcon } from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { Can } from '@indocal/services';

import {
  UserRolePermissionsManagementPanelProvider,
  useUserRolePermissionsManagementPanel,
  UserRolePermissionsManagementPanelProviderProps,
} from './context';
import {
  UsersScopePermissions,
  UsersRolesScopePermissions,
  UsersGroupsScopePermissions,
  FormsScopePermissions,
  EventsScopePermissions,
  WarehouseScopePermissions,
} from './components';

const UserRolePermissionsManagementPanel: React.FC = () => {
  const { loading, validating, saving, role, error, save } =
    useUserRolePermissionsManagementPanel();

  return (
    <Paper>
      {loading ? (
        <Loader invisible message="Cargando permisos..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : role ? (
        <Stack
          sx={{ position: 'relative', padding: (theme) => theme.spacing(2) }}
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
            <Typography variant="h6" fontWeight="bolder">
              Permisos
            </Typography>

            <Can I="update" an="userRole">
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
            </Can>
          </Stack>

          <UsersScopePermissions />
          <UsersRolesScopePermissions />
          <UsersGroupsScopePermissions />
          <FormsScopePermissions />
          <EventsScopePermissions />
          <WarehouseScopePermissions />
        </Stack>
      ) : (
        <NoData message="No se han encontrado datos del rol" />
      )}
    </Paper>
  );
};

const UserRolePermissionsManagementPanelWrapper: React.FC<
  UserRolePermissionsManagementPanelProviderProps
> = (props) => (
  <UserRolePermissionsManagementPanelProvider {...props}>
    <UserRolePermissionsManagementPanel />
  </UserRolePermissionsManagementPanelProvider>
);

export { UserRolePermissionsManagementPanelWrapper as UserRolePermissionsManagementPanel };

export default UserRolePermissionsManagementPanelWrapper;
