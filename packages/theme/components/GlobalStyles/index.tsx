import { GlobalStyles as MuiGlobalStyles, useTheme } from '@mui/material';

export const GlobalStyles: React.FC = () => {
  const theme = useTheme();

  return (
    <MuiGlobalStyles
      styles={{
        '*': {
          '&::-webkit-scrollbar': {
            width: theme.spacing(0.75),
            height: theme.spacing(0.75),
            backgroundColor: theme.palette.background.paper,
          },

          '&::-webkit-scrollbar-track': {
            borderRadius: theme.spacing(1),
            backgroundColor: theme.palette.background.paper,
          },

          '&::-webkit-scrollbar-thumb': {
            borderRadius: theme.spacing(1),
            backgroundColor: theme.palette.primary.main,
          },
        },
      }}
    />
  );
};

export default GlobalStyles;
