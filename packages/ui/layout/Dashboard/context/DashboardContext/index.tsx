import {
  useReducer,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import { useMediaQuery, Theme } from '@mui/material';

import { DASHBOARD_LOCALE_STORAGE_KEYS } from '../../config';

///////////
// Types //
///////////

export type DashboardDrawerPosition = 'left' | 'right';

///////////
// State //
///////////

const initialContextState: DashboardContextState = {
  isDrawerOpen: true,
  drawerPosition: 'left',
};

interface DashboardContextState {
  isDrawerOpen: boolean;
  drawerPosition: DashboardDrawerPosition;
}

type DashboardContextStateAction =
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'TOGGLE_DRAWER' }
  | { type: 'TOGGLE_DRAWER_POSITION' }
  | { type: 'SET_DRAWER_POSITION'; position: DashboardDrawerPosition }
  | { type: 'RESET_PREFERENCES' };

function reducer(
  state: DashboardContextState,
  action: DashboardContextStateAction
): DashboardContextState {
  switch (action.type) {
    case 'OPEN_DRAWER': {
      return { ...state, isDrawerOpen: true };
    }

    case 'CLOSE_DRAWER': {
      return { ...state, isDrawerOpen: false };
    }

    case 'TOGGLE_DRAWER': {
      return { ...state, isDrawerOpen: !state.isDrawerOpen };
    }

    case 'TOGGLE_DRAWER_POSITION': {
      const position = state.drawerPosition === 'left' ? 'right' : 'left';

      window.localStorage.setItem(
        DASHBOARD_LOCALE_STORAGE_KEYS.DRAWER_POSITION,
        JSON.stringify(position)
      );

      return {
        ...state,
        drawerPosition: position,
      };
    }

    case 'SET_DRAWER_POSITION': {
      window.localStorage.setItem(
        DASHBOARD_LOCALE_STORAGE_KEYS.DRAWER_POSITION,
        JSON.stringify(action.position)
      );

      return {
        ...state,
        drawerPosition: action.position,
      };
    }

    case 'RESET_PREFERENCES': {
      window.localStorage.removeItem(
        DASHBOARD_LOCALE_STORAGE_KEYS.DRAWER_POSITION
      );

      return initialContextState;
    }

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: DashboardContextValue = {
  isDrawerOpen: initialContextState.isDrawerOpen,
  drawerPosition: initialContextState.drawerPosition,
  openDrawer: () => undefined,
  closeDrawer: () => undefined,
  toggleDrawer: () => undefined,
  toggleDrawerPosition: () => undefined,
  setDrawerPosition: () => undefined,
  resetPreferences: () => undefined,
};

export interface DashboardContextValue {
  isDrawerOpen: boolean;
  drawerPosition: DashboardDrawerPosition;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  toggleDrawerPosition: () => void;
  setDrawerPosition: (position: DashboardDrawerPosition) => void;
  resetPreferences: () => void;
}

const DashboardContext =
  createContext<DashboardContextValue>(initialContextValue);

export const DashboardProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const isSmallDevice = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm')
  );

  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleOpenDrawer = useCallback(
    () => dispatch({ type: 'OPEN_DRAWER' }),
    []
  );

  const handleCloseDrawer = useCallback(
    () => dispatch({ type: 'CLOSE_DRAWER' }),
    []
  );

  const handleToggleDrawer = useCallback(
    () => dispatch({ type: 'TOGGLE_DRAWER' }),
    []
  );

  const handleToggleDrawerPosition = useCallback(
    () => dispatch({ type: 'TOGGLE_DRAWER_POSITION' }),
    []
  );

  const handleSetDrawerPosition = useCallback(
    (position: DashboardDrawerPosition) =>
      dispatch({ type: 'SET_DRAWER_POSITION', position }),
    []
  );

  const handleResetPreferences = useCallback(
    () => dispatch({ type: 'RESET_PREFERENCES' }),
    []
  );

  useEffect(() => {
    try {
      const drawerPosition = window.localStorage.getItem(
        DASHBOARD_LOCALE_STORAGE_KEYS.DRAWER_POSITION
      ) as DashboardDrawerPosition | null;

      handleSetDrawerPosition(
        drawerPosition
          ? JSON.parse(drawerPosition)
          : initialContextValue.drawerPosition
      );
    } catch {
      handleSetDrawerPosition(initialContextValue.drawerPosition);
    }
  }, [handleSetDrawerPosition]);

  return (
    <DashboardContext.Provider
      value={{
        isDrawerOpen: state.isDrawerOpen && isSmallDevice,
        drawerPosition: state.drawerPosition,
        openDrawer: handleOpenDrawer,
        closeDrawer: handleCloseDrawer,
        toggleDrawer: handleToggleDrawer,
        toggleDrawerPosition: handleToggleDrawerPosition,
        setDrawerPosition: handleSetDrawerPosition,
        resetPreferences: handleResetPreferences,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export function useDashboard(): DashboardContextValue {
  return useContext(DashboardContext);
}

export default DashboardProvider;
