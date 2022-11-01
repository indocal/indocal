import { Box } from '@mui/material';

import { DashboardProvider, useDashboard } from './context';
import {
  DashboardAppBar,
  DashboardDrawer,
  DrawerNavigation,
} from './components';
import { DASHBOARD_SIZES } from './config';

export interface DashboardProps {
  appBarContent?: React.ReactElement;
  drawerHeader?: React.ReactElement;
  drawerNavigation?: DrawerNavigation[];
  drawerNavigationRootPaths?: string[];
  drawerFooter?: React.ReactElement;
}

const Dashboard: React.FC<React.PropsWithChildren<DashboardProps>> = ({
  appBarContent,
  drawerHeader,
  drawerNavigation,
  drawerNavigationRootPaths,
  drawerFooter,
  children,
}) => {
  const { drawerPosition } = useDashboard();

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <DashboardAppBar>{appBarContent}</DashboardAppBar>

      {drawerPosition === 'left' && (
        <DashboardDrawer
          header={drawerHeader}
          navigation={drawerNavigation}
          rootPaths={drawerNavigationRootPaths}
          footer={drawerFooter}
        />
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '1fr',
          width: '100%',
          height: `calc(100% - ${DASHBOARD_SIZES.HEADER_HEIGHT})`,
          marginTop: DASHBOARD_SIZES.HEADER_HEIGHT,
          overflow: 'auto',
        }}
      >
        {children}
      </Box>

      {drawerPosition === 'right' && (
        <DashboardDrawer
          header={drawerHeader}
          navigation={drawerNavigation}
          rootPaths={drawerNavigationRootPaths}
          footer={drawerFooter}
        />
      )}
    </Box>
  );
};

const DashboardWrapper: React.FC<React.PropsWithChildren<DashboardProps>> = (
  props
) => (
  <DashboardProvider>
    <Dashboard {...props} />
  </DashboardProvider>
);

export { DashboardWrapper as Dashboard };

export default DashboardWrapper;

////////////////
// Re-exports //
////////////////

export { useDashboard } from './context';
export type { DashboardDrawerPosition } from './context';
export { ToggleDrawerPositionButton } from './components';
export type {
  DrawerNavigation,
  DrawerNavigationMenu,
  DrawerNavigationItem,
} from './components';
