import {
  AppBar,
  Toolbar,
  IconButton,
  useMediaQuery,
  Theme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

import { useDashboard } from '../../context';
import { DASHBOARD_SIZES } from '../../config';

export const DashboardAppBar: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const isSmallDevice = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm')
  );

  const { isDrawerOpen, drawerPosition, openDrawer, closeDrawer } =
    useDashboard();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: DASHBOARD_SIZES.HEADER_HEIGHT,
        transition: (theme) =>
          theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        ...(isDrawerOpen && {
          width: `calc(100% - ${DASHBOARD_SIZES.DRAWER_WIDTH})`,
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          ...(drawerPosition === 'left'
            ? { marginLeft: DASHBOARD_SIZES.DRAWER_WIDTH }
            : { marginRight: DASHBOARD_SIZES.DRAWER_WIDTH }),
        }),
      }}
    >
      <Toolbar
        sx={{
          justifyContent: drawerPosition === 'left' ? 'flex-start' : 'flex-end',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {drawerPosition === 'right' && children}

        <IconButton
          edge={drawerPosition === 'left' ? 'start' : 'end'}
          color="inherit"
          onClick={closeDrawer}
          sx={{ ...(!isDrawerOpen && { display: 'none' }) }}
        >
          {drawerPosition === 'left' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>

        <IconButton
          edge={drawerPosition === 'left' ? 'start' : 'end'}
          color="inherit"
          onClick={openDrawer}
          sx={{ ...((isDrawerOpen || !isSmallDevice) && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>

        {drawerPosition === 'left' && children}
      </Toolbar>
    </AppBar>
  );
};

export default DashboardAppBar;
