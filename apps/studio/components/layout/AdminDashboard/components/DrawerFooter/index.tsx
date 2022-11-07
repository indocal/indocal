import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import {
  Tooltip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Logout as SignOutIcon } from '@mui/icons-material';

import { useDashboard } from '@indocal/ui';

export const AdminDashboardDrawerFooter: React.FC = () => {
  const { isDrawerOpen, drawerPosition } = useDashboard();

  const handleSignOut = useCallback(async () => {
    const answer = window.confirm('¿Estás seguro de que deseas cerrar sesión?');

    if (!answer) return;

    await signOut();
  }, []);

  return (
    <Tooltip
      title={!isDrawerOpen ? 'Cerrar sesión' : ''}
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
