import { useMemo } from 'react';
import Head from 'next/head';
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  useMediaQuery,
  createTheme,
} from '@mui/material';
import { esES as coreEsES } from '@mui/material/locale';
import { esES as dataGridEsEs } from '@mui/x-data-grid/locales';
import {
  LocalizationProvider,
  esES as datePickersEsES,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import dateFnsEs from 'date-fns/locale/es';

import {
  UserThemePreferencesProvider,
  useUserThemePreferences,
} from '../../context';
import { GlobalStyles } from '../../components';

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const { colorMode, primaryColor, secondaryColor } = useUserThemePreferences();

  const theme = useMemo(
    () =>
      createTheme(
        {
          palette: {
            mode:
              colorMode === 'system'
                ? prefersDarkMode
                  ? 'dark'
                  : 'light'
                : colorMode,
            primary: {
              main: primaryColor,
            },
            secondary: {
              main: secondaryColor,
            },
          },
        },
        dataGridEsEs,
        datePickersEsES,
        coreEsES
      ),
    [prefersDarkMode, colorMode, primaryColor, secondaryColor]
  );

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MuiThemeProvider theme={theme}>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={dateFnsEs}
        >
          <CssBaseline />
          <GlobalStyles />
          {children}
        </LocalizationProvider>
      </MuiThemeProvider>
    </>
  );
};

const ThemeProviderWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <UserThemePreferencesProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </UserThemePreferencesProvider>
);

export { ThemeProviderWrapper as ThemeProvider };

export default ThemeProviderWrapper;
