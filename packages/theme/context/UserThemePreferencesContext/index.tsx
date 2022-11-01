import {
  useReducer,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import { PaletteMode } from '@mui/material';

import { DEFAULT_THEME_COLORS, THEME_LOCALE_STORAGE_KEYS } from '../../config';

///////////
// Types //
///////////

export type UserThemePreferencesColorMode = PaletteMode | 'system';

///////////
// State //
///////////

const initialContextState: UserThemePreferencesContextState = {
  colorMode: 'system',
  primaryColor: DEFAULT_THEME_COLORS.PRIMARY_COLOR,
  secondaryColor: DEFAULT_THEME_COLORS.SECONDARY_COLOR,
};

interface UserThemePreferencesContextState {
  colorMode: UserThemePreferencesColorMode;
  primaryColor: string;
  secondaryColor: string;
}

type UserThemePreferencesContextStateAction =
  | { type: 'TOGGLE_COLOR_MODE' }
  | { type: 'SET_COLOR_MODE'; colorMode: UserThemePreferencesColorMode }
  | { type: 'SET_PRIMARY_COLOR'; color: string }
  | { type: 'SET_SECONDARY_COLOR'; color: string }
  | { type: 'RESET_PREFERENCES' };

function reducer(
  state: UserThemePreferencesContextState,
  action: UserThemePreferencesContextStateAction
): UserThemePreferencesContextState {
  switch (action.type) {
    case 'TOGGLE_COLOR_MODE': {
      const mode =
        state.colorMode === 'system'
          ? 'light'
          : state.colorMode === 'light'
          ? 'dark'
          : 'system';

      window.localStorage.setItem(
        THEME_LOCALE_STORAGE_KEYS.COLOR_MODE,
        JSON.stringify(mode)
      );

      return {
        ...state,
        colorMode: mode,
      };
    }

    case 'SET_COLOR_MODE': {
      window.localStorage.setItem(
        THEME_LOCALE_STORAGE_KEYS.COLOR_MODE,
        JSON.stringify(action.colorMode)
      );

      return {
        ...state,
        colorMode: action.colorMode,
      };
    }

    case 'SET_PRIMARY_COLOR': {
      window.localStorage.setItem(
        THEME_LOCALE_STORAGE_KEYS.PRIMARY_COLOR,
        JSON.stringify(action.color)
      );

      return {
        ...state,
        primaryColor: action.color,
      };
    }

    case 'SET_SECONDARY_COLOR': {
      window.localStorage.setItem(
        THEME_LOCALE_STORAGE_KEYS.SECONDARY_COLOR,
        JSON.stringify(action.color)
      );

      return {
        ...state,
        secondaryColor: action.color,
      };
    }

    case 'RESET_PREFERENCES': {
      window.localStorage.removeItem(THEME_LOCALE_STORAGE_KEYS.COLOR_MODE);
      window.localStorage.removeItem(THEME_LOCALE_STORAGE_KEYS.PRIMARY_COLOR);
      window.localStorage.removeItem(THEME_LOCALE_STORAGE_KEYS.SECONDARY_COLOR);

      return initialContextState;
    }

    default:
      throw new Error('Action Not Allowed');
  }
}

/////////////
// Context //
/////////////

export const initialContextValue: UserThemePreferencesContextValue = {
  colorMode: initialContextState.colorMode,
  primaryColor: initialContextState.primaryColor,
  secondaryColor: initialContextState.secondaryColor,
  toggleColorMode: () => undefined,
  setColorMode: () => undefined,
  setPrimaryColor: () => undefined,
  setSecondaryColor: () => undefined,
  resetPreferences: () => undefined,
};

export interface UserThemePreferencesContextValue {
  colorMode: UserThemePreferencesColorMode;
  primaryColor: string;
  secondaryColor: string;
  toggleColorMode: () => void;
  setColorMode: (colorMode: UserThemePreferencesColorMode) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  resetPreferences: () => void;
}

const UserThemePreferencesContext =
  createContext<UserThemePreferencesContextValue>(initialContextValue);

export const UserThemePreferencesProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleToggleColorMode = useCallback(
    () => dispatch({ type: 'TOGGLE_COLOR_MODE' }),
    []
  );

  const handleSetColorMode = useCallback(
    (colorMode: UserThemePreferencesColorMode) =>
      dispatch({ type: 'SET_COLOR_MODE', colorMode }),
    []
  );

  const handleSetPrimaryColor = useCallback(
    (color: string) => dispatch({ type: 'SET_PRIMARY_COLOR', color }),
    []
  );

  const handleSetSecondaryColor = useCallback(
    (color: string) => dispatch({ type: 'SET_SECONDARY_COLOR', color }),
    []
  );

  const handleResetPreferences = useCallback(
    () => dispatch({ type: 'RESET_PREFERENCES' }),
    []
  );

  useEffect(() => {
    try {
      const colorMode = window.localStorage.getItem(
        THEME_LOCALE_STORAGE_KEYS.COLOR_MODE
      ) as UserThemePreferencesColorMode | null;

      const primaryColor = window.localStorage.getItem(
        THEME_LOCALE_STORAGE_KEYS.PRIMARY_COLOR
      );

      const secondaryColor = window.localStorage.getItem(
        THEME_LOCALE_STORAGE_KEYS.SECONDARY_COLOR
      );

      handleSetColorMode(
        colorMode ? JSON.parse(colorMode) : initialContextValue.colorMode
      );

      handleSetPrimaryColor(
        primaryColor
          ? JSON.parse(primaryColor)
          : initialContextValue.primaryColor
      );

      handleSetSecondaryColor(
        secondaryColor
          ? JSON.parse(secondaryColor)
          : initialContextValue.secondaryColor
      );
    } catch {
      handleSetColorMode(initialContextValue.colorMode);
      handleSetPrimaryColor(initialContextValue.primaryColor);
      handleSetSecondaryColor(initialContextValue.secondaryColor);
    }
  }, [handleSetColorMode, handleSetPrimaryColor, handleSetSecondaryColor]);

  return (
    <UserThemePreferencesContext.Provider
      value={{
        colorMode: state.colorMode,
        primaryColor: state.primaryColor,
        secondaryColor: state.secondaryColor,
        setPrimaryColor: handleSetPrimaryColor,
        setSecondaryColor: handleSetSecondaryColor,
        toggleColorMode: handleToggleColorMode,
        setColorMode: handleSetColorMode,
        resetPreferences: handleResetPreferences,
      }}
    >
      {children}
    </UserThemePreferencesContext.Provider>
  );
};

export function useUserThemePreferences(): UserThemePreferencesContextValue {
  return useContext(UserThemePreferencesContext);
}

export default UserThemePreferencesProvider;
