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
    const response = window.confirm('¿Estás seguro que quieres cerrar sesión?');

    if (response) await signOut();
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
