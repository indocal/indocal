import { Box, Drawer } from '@mui/material';

import { useDashboard } from '../../context';
import { DASHBOARD_SIZES } from '../../config';

import {
  DashboardDrawerNavigationMenu,
  DashboardDrawerNavigationItem,
} from './components';
import { DrawerNavigation } from './types';

export interface DashboardDrawerProps {
  header?: React.ReactElement;
  navigation?: DrawerNavigation[];
  rootPaths?: string[];
  footer?: React.ReactElement;
}

export const DashboardDrawer: React.FC<DashboardDrawerProps> = ({
  header,
  navigation,
  rootPaths,
  footer,
}) => {
  const { isDrawerOpen, drawerPosition } = useDashboard();

  return (
    <Drawer
      variant="permanent"
      open={isDrawerOpen}
      sx={{
        '& .MuiDrawer-paper': {
          position: 'relative',
          width: DASHBOARD_SIZES.DRAWER_WIDTH,
          height: '100%',
          overflow: 'hidden',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          ...(!isDrawerOpen && {
            width: (theme) => theme.spacing(7),
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }),
          ...(drawerPosition === 'right' && {
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }),
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: DASHBOARD_SIZES.HEADER_HEIGHT,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        {isDrawerOpen && header}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: `calc(100% - ${DASHBOARD_SIZES.HEADER_HEIGHT})`,
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ paddingY: (theme) => theme.spacing(0.5) }}>
          {navigation?.map((element) =>
            element.type === 'MENU' ? (
              <DashboardDrawerNavigationMenu
                key={element.value.label}
                menu={element.value}
                rootPaths={rootPaths}
              />
            ) : (
              <DashboardDrawerNavigationItem
                key={element.value.href}
                item={element.value}
                rootPaths={rootPaths}
              />
            )
          )}
        </Box>

        {footer && (
          <Box
            sx={{
              marginTop: 'auto',
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            {footer}
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default DashboardDrawer;

////////////////
// Re-exports //
////////////////

export * from './components';
export * from './types';
