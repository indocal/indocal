import { useMemo } from 'react';
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
import { ScopePermissions } from './components';
import { ScopePermissionsPanel } from './types';

const UserRolePermissionsManagementPanel: React.FC = () => {
  const { loading, validating, saving, role, permissions, error, save } =
    useUserRolePermissionsManagementPanel();

  const panels = useMemo<ScopePermissionsPanel[]>(
    () => [
      {
        label: 'Registros',
        subPanels: [
          {
            scope: 'log',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.log) &&
                  Boolean(permissions?.log['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.log) &&
                  Boolean(permissions?.log['read']),
              },
            ],
          },
        ],
      },
      {
        label: 'Usuarios',
        subPanels: [
          {
            scope: 'user',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.user) &&
                  Boolean(permissions?.user['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.user) &&
                  Boolean(permissions?.user['read']),
              },
              {
                label: 'Crear',
                action: 'create',
                checked:
                  Boolean(permissions?.user) &&
                  Boolean(permissions?.user['create']),
              },
              {
                label: 'Modificar',
                action: 'update',
                checked:
                  Boolean(permissions?.user) &&
                  Boolean(permissions?.user['update']),
              },
              {
                label: 'Borrar',
                action: 'delete',
                checked:
                  Boolean(permissions?.user) &&
                  Boolean(permissions?.user['delete']),
              },
            ],
          },
        ],
      },
      {
        label: 'Roles',
        subPanels: [
          {
            scope: 'userRole',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.userRole) &&
                  Boolean(permissions?.userRole['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.userRole) &&
                  Boolean(permissions?.userRole['read']),
              },
              {
                label: 'Crear',
                action: 'create',
                checked:
                  Boolean(permissions?.userRole) &&
                  Boolean(permissions?.userRole['create']),
              },
              {
                label: 'Modificar',
                action: 'update',
                checked:
                  Boolean(permissions?.userRole) &&
                  Boolean(permissions?.userRole['update']),
              },
              {
                label: 'Borrar',
                action: 'delete',
                checked:
                  Boolean(permissions?.userRole) &&
                  Boolean(permissions?.userRole['delete']),
              },
            ],
          },
          {
            scope: 'userRolePermission',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.userRolePermission) &&
                  Boolean(permissions?.userRolePermission['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.userRolePermission) &&
                  Boolean(permissions?.userRolePermission['read']),
              },
            ],
          },
        ],
      },
      {
        label: 'Grupos',
        subPanels: [
          {
            scope: 'userGroup',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.userGroup) &&
                  Boolean(permissions?.userGroup['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.userGroup) &&
                  Boolean(permissions?.userGroup['read']),
              },
              {
                label: 'Crear',
                action: 'create',
                checked:
                  Boolean(permissions?.userGroup) &&
                  Boolean(permissions?.userGroup['create']),
              },
              {
                label: 'Modificar',
                action: 'update',
                checked:
                  Boolean(permissions?.userGroup) &&
                  Boolean(permissions?.userGroup['update']),
              },
              {
                label: 'Borrar',
                action: 'delete',
                checked:
                  Boolean(permissions?.userGroup) &&
                  Boolean(permissions?.userGroup['delete']),
              },
            ],
          },
        ],
      },
      {
        label: 'Formularios',
        subPanels: [
          {
            scope: 'form',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.form) &&
                  Boolean(permissions?.form['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.form) &&
                  Boolean(permissions?.form['read']),
              },
              {
                label: 'Crear',
                action: 'create',
                checked:
                  Boolean(permissions?.form) &&
                  Boolean(permissions?.form['create']),
              },
              {
                label: 'Modificar',
                action: 'update',
                checked:
                  Boolean(permissions?.form) &&
                  Boolean(permissions?.form['update']),
              },
              {
                label: 'Borrar',
                action: 'delete',
                checked:
                  Boolean(permissions?.form) &&
                  Boolean(permissions?.form['delete']),
              },
              {
                label: 'Generar reportes',
                action: 'generate-reports',
                checked:
                  Boolean(permissions?.form) &&
                  Boolean(permissions?.form['generate-reports']),
              },
            ],
          },
          {
            scope: 'formField',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.formField) &&
                  Boolean(permissions?.formField['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.formField) &&
                  Boolean(permissions?.formField['read']),
              },
              {
                label: 'Crear',
                action: 'create',
                checked:
                  Boolean(permissions?.formField) &&
                  Boolean(permissions?.formField['create']),
              },
              {
                label: 'Modificar',
                action: 'update',
                checked:
                  Boolean(permissions?.formField) &&
                  Boolean(permissions?.formField['update']),
              },
              {
                label: 'Borrar',
                action: 'delete',
                checked:
                  Boolean(permissions?.formField) &&
                  Boolean(permissions?.formField['delete']),
              },
            ],
          },
          {
            scope: 'formEntry',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.formEntry) &&
                  Boolean(permissions?.formEntry['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.formEntry) &&
                  Boolean(permissions?.formEntry['read']),
              },
              {
                label: 'Crear',
                action: 'create',
                checked:
                  Boolean(permissions?.formEntry) &&
                  Boolean(permissions?.formEntry['create']),
              },
              {
                label: 'Borrar',
                action: 'delete',
                checked:
                  Boolean(permissions?.formEntry) &&
                  Boolean(permissions?.formEntry['delete']),
              },
            ],
          },
        ],
      },
      {
        label: 'Librería de archivos',
        subPanels: [
          {
            scope: 'file',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.file) &&
                  Boolean(permissions?.file['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.file) &&
                  Boolean(permissions?.file['read']),
              },
              {
                label: 'Cargar archivos',
                action: 'upload',
                checked:
                  Boolean(permissions?.file) &&
                  Boolean(permissions?.file['upload']),
              },
              {
                label: 'Modificar',
                action: 'update',
                checked:
                  Boolean(permissions?.file) &&
                  Boolean(permissions?.file['update']),
              },
              {
                label: 'Borrar',
                action: 'delete',
                checked:
                  Boolean(permissions?.file) &&
                  Boolean(permissions?.file['delete']),
              },
            ],
          },
          {
            scope: 'folder',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.folder) &&
                  Boolean(permissions?.folder['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.folder) &&
                  Boolean(permissions?.folder['read']),
              },
              {
                label: 'Crear',
                action: 'create',
                checked:
                  Boolean(permissions?.folder) &&
                  Boolean(permissions?.folder['create']),
              },
              {
                label: 'Modificar',
                action: 'update',
                checked:
                  Boolean(permissions?.folder) &&
                  Boolean(permissions?.folder['update']),
              },
              {
                label: 'Borrar',
                action: 'delete',
                checked:
                  Boolean(permissions?.folder) &&
                  Boolean(permissions?.folder['delete']),
              },
            ],
          },
        ],
      },
      {
        label: 'Almacén & Suministro',
        subPanels: [
          {
            scope: 'supply',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.supply) &&
                  Boolean(permissions?.supply['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.supply) &&
                  Boolean(permissions?.supply['read']),
              },
              {
                label: 'Crear',
                action: 'create',
                checked:
                  Boolean(permissions?.supply) &&
                  Boolean(permissions?.supply['create']),
              },
              {
                label: 'Modificar',
                action: 'update',
                checked:
                  Boolean(permissions?.supply) &&
                  Boolean(permissions?.supply['update']),
              },
              {
                label: 'Borrar',
                action: 'delete',
                checked:
                  Boolean(permissions?.supply) &&
                  Boolean(permissions?.supply['delete']),
              },
              {
                label: 'Consultar precios',
                action: 'get-prices',
                checked:
                  Boolean(permissions?.supply) &&
                  Boolean(permissions?.supply['get-prices']),
              },
            ],
          },
          {
            scope: 'supplier',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.supplier) &&
                  Boolean(permissions?.supplier['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.supplier) &&
                  Boolean(permissions?.supplier['read']),
              },
              {
                label: 'Crear',
                action: 'create',
                checked:
                  Boolean(permissions?.supplier) &&
                  Boolean(permissions?.supplier['create']),
              },
              {
                label: 'Modificar',
                action: 'update',
                checked:
                  Boolean(permissions?.supplier) &&
                  Boolean(permissions?.supplier['update']),
              },
              {
                label: 'Borrar',
                action: 'delete',
                checked:
                  Boolean(permissions?.supplier) &&
                  Boolean(permissions?.supplier['delete']),
              },
            ],
          },
          {
            scope: 'order',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.order) &&
                  Boolean(permissions?.order['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.order) &&
                  Boolean(permissions?.order['read']),
              },
              {
                label: 'Crear',
                action: 'create',
                checked:
                  Boolean(permissions?.order) &&
                  Boolean(permissions?.order['create']),
              },
              {
                label: 'Modificar',
                action: 'update',
                checked:
                  Boolean(permissions?.order) &&
                  Boolean(permissions?.order['update']),
              },
              {
                label: 'Borrar',
                action: 'delete',
                checked:
                  Boolean(permissions?.order) &&
                  Boolean(permissions?.order['delete']),
              },
              {
                label: 'Recibir artículos',
                action: 'receive-items',
                checked:
                  Boolean(permissions?.order) &&
                  Boolean(permissions?.order['receive-items']),
              },
            ],
          },
          {
            scope: 'orderItem',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.orderItem) &&
                  Boolean(permissions?.orderItem['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.orderItem) &&
                  Boolean(permissions?.orderItem['read']),
              },
            ],
          },
          {
            scope: 'inventoryMovement',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.inventoryMovement) &&
                  Boolean(permissions?.inventoryMovement['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.inventoryMovement) &&
                  Boolean(permissions?.inventoryMovement['read']),
              },
              {
                label: 'Crear',
                action: 'create',
                checked:
                  Boolean(permissions?.inventoryMovement) &&
                  Boolean(permissions?.inventoryMovement['create']),
              },
            ],
          },
          {
            scope: 'inventoryMovementItem',
            permissions: [
              {
                label: 'Contar',
                action: 'count',
                checked:
                  Boolean(permissions?.inventoryMovementItem) &&
                  Boolean(permissions?.inventoryMovementItem['count']),
              },
              {
                label: 'Leer',
                action: 'read',
                checked:
                  Boolean(permissions?.inventoryMovementItem) &&
                  Boolean(permissions?.inventoryMovementItem['read']),
              },
            ],
          },
        ],
      },
    ],
    [permissions]
  );

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

          {panels.map((panel) => (
            <ScopePermissions key={panel.label} panel={panel} />
          ))}
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
