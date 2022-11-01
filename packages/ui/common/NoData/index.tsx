import Image from 'next/image';
import { Box, Typography } from '@mui/material';

import { notData } from './assets';

export interface NoDataProps {
  message?: string;
}

export const NoData: React.FC<NoDataProps> = ({ message }) => (
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
      <Image priority alt={message} src={notData} />
    </Box>

    <Typography
      variant="caption"
      align="center"
      fontWeight="bolder"
      color="textSecondary"
    >
      {message || 'Sin datos'}
    </Typography>
  </Box>
);

export default NoData;
