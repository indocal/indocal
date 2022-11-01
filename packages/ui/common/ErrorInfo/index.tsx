import Image from 'next/image';
import { Box, Typography } from '@mui/material';

import { warning } from './assets';

export interface ErrorInfoProps {
  error: Error;
}

export const ErrorInfo: React.FC<ErrorInfoProps> = ({ error }) => (
  <Box
    sx={{
      display: 'grid',
      placeContent: 'center',
      placeItems: 'center',
      gap: (theme) => theme.spacing(1),
      width: '100%',
      height: '100%',
      padding: (theme) => theme.spacing(4),
      overflow: 'auto',
    }}
  >
    <Box sx={{ maxWidth: (theme) => theme.spacing(10) }}>
      <Image priority alt={error.message} src={warning} />
    </Box>

    <Typography
      variant="caption"
      align="center"
      fontWeight="bolder"
      color="textSecondary"
    >
      {error.message || 'Ha ocurrido un error inesperado'}
    </Typography>
  </Box>
);

export default ErrorInfo;
