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

import { useDashboard } from '@indocal/ui';
import { useAbility } from '@indocal/services';

import { indocal } from '@/lib';

export const AdminDashboardDrawerFooter: React.FC = () => {
  const ability = useAbility();

  const { isDrawerOpen, drawerPosition } = useDashboard();

  const { enqueueSnackbar } = useSnackbar();

  const handleSignOut = useCallback(() => {
    const answer = window.confirm('¿Estás seguro de que deseas cerrar sesión?');

    if (!answer) return;

    signOut()
      .then(() => indocal.auth.signOut().then(() => ability.update([])))
      .catch((error) =>
        enqueueSnackbar(
          error instanceof Error
            ? error.message
            : 'Ha ocurrido un error al cerrar sesión, inténtelo de nuevo. Si el error persiste, contacte al soporte',
          { variant: 'error' }
        )
      );
  }, [ability, enqueueSnackbar]);

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
