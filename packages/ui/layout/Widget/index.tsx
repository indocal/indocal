import { Box, BoxProps } from '@mui/material';

import { ErrorBoundary } from '../../common';

import { WIDGET_SIZES } from './config';

export interface WidgetProps extends BoxProps {
  errorBoundaryMessage?: string;
  disableDefaultSizes?: boolean;
}

export const Widget: React.FC<React.PropsWithChildren<WidgetProps>> = ({
  errorBoundaryMessage = 'Ha ocurrido un error al cargar este widget',
  disableDefaultSizes,
  children,
  ...rest
}) => (
  <ErrorBoundary message={errorBoundaryMessage}>
    <Box
      height={
        disableDefaultSizes || rest.height ? rest.height : WIDGET_SIZES.HEIGHT
      }
      {...rest}
    >
      {children}
    </Box>
  </ErrorBoundary>
);

export default Widget;

////////////////
// Re-exports //
////////////////

export { WIDGET_SIZES } from './config';
