import { Box, Paper, Typography } from '@mui/material';

import { Logo } from '../../../../common';

export const BasicLayoutFooter: React.FC = () => (
  <Paper sx={{ padding: (theme) => theme.spacing(2) }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        '::before': {
          content: '""',
          flexGrow: 1,
          marginRight: (theme) => theme.spacing(2),
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        },
        '::after': {
          content: '""',
          flexGrow: 1,
          marginLeft: (theme) => theme.spacing(2),
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '16 / 9',
          width: (theme) => theme.spacing(8),
        }}
      >
        <Logo variant="short" />
      </Box>
    </Box>

    <Typography
      variant="caption"
      align="center"
      fontWeight="bolder"
      sx={{
        display: 'block',
        marginTop: (theme) => theme.spacing(2),
      }}
    >
      {`© ${new Date().getFullYear()} - Todos los derechos reservados`}
    </Typography>
  </Paper>
);

export default BasicLayoutFooter;
