import { Box } from '@mui/material';

import { ToggleColorModeButton } from '@indocal/theme';

export const AdminDashboardAppBarContent: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: (theme) => theme.spacing(1),
      width: '100%',
      height: '100%',
    }}
  >
    <ToggleColorModeButton />
  </Box>
);

export default AdminDashboardAppBarContent;
