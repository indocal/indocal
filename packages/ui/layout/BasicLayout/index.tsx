import { Box, AppBar } from '@mui/material';

import { BasicLayoutFooter } from './components';
import { BASIC_LAYOUT_SIZES } from './config';

export interface BasicLayoutProps {
  header?: React.ReactElement;
}

export const BasicLayout: React.FC<
  React.PropsWithChildren<BasicLayoutProps>
> = ({ header, children }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: `${BASIC_LAYOUT_SIZES.HEADER_HEIGHT} 1fr`,
      gridTemplateAreas: `
        'header'
        'content'
      `,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
    }}
  >
    <AppBar position="sticky" sx={{ display: 'grid', gridArea: 'header' }}>
      {header}
    </AppBar>

    <Box
      sx={{
        display: 'grid',
        gridArea: 'content',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
        overflow: 'auto',
      }}
    >
      {children}

      <Box sx={{ marginTop: 'auto' }}>
        <BasicLayoutFooter />
      </Box>
    </Box>
  </Box>
);

export default BasicLayout;
