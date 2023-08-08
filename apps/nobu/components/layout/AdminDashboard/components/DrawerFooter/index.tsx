import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import {
  Tooltip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Logout as SignOutIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';

import { useDashboard } from '@indocal/ui';
import { useAppAbility } from '@indocal/services';

import { indocal } from '@/lib';

export const AdminDashboardDrawerFooter: React.FC = () => {
  const ability = useAppAbility();

  const { isDrawerOpen, drawerPosition } = useDashboard();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const handleSignOut = useCallback(() => {
    confirm({
      title: '¿Estás seguro de que deseas cerrar sesión?',
      description:
        'Si cierras sesión, no podrás acceder a la aplicación hasta que vuelvas a iniciar sesión.',

      confirmationText: 'Cerrar sesión',
      confirmationButtonProps: { color: 'error' },
      cancellationButtonProps: { color: 'primary' },
    })
      .then(() =>
        signOut()
          .then(() =>
            indocal.auth
              .signOut()
              .then(() => ability.update([]))
              .catch(() => undefined)
          )
          .catch((error) =>
            enqueueSnackbar(
              error instanceof Error
                ? error.message
                : 'Ha ocurrido un error al cerrar sesión, inténtelo de nuevo. Si el error persiste, contacte al soporte',
              { variant: 'error' }
            )
          )
      )
      .catch(() => undefined);
  }, [ability, enqueueSnackbar, confirm]);

  return (
    <Tooltip
      title={!isDrawerOpen && 'Cerrar sesión'}
      placement={drawerPosition === 'left' ? 'right' : 'left'}
    >
      <ListItemButton onClick={handleSignOut}>
        <ListItemIcon>
          <SignOutIcon color="error" />
        </ListItemIcon>

        {isDrawerOpen && (
          <ListItemText sx={{ whiteSpace: 'nowrap' }}>
            Cerrar sesión
          </ListItemText>
        )}
      </ListItemButton>
    </Tooltip>
  );
};

export default AdminDashboardDrawerFooter;
