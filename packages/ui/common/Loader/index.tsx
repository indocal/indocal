import { Backdrop, CircularProgress, Typography } from '@mui/material';

export interface LoaderProps {
  fullscreen?: boolean;
  invisible?: boolean;
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  fullscreen,
  invisible,
  message,
}) => (
  <Backdrop
    open
    invisible={invisible}
    sx={{
      position: fullscreen ? 'fixed' : 'relative',
      zIndex: (theme) => (fullscreen ? theme.zIndex.tooltip + 1 : 'initial'),
      display: 'grid',
      placeContent: 'center',
      placeItems: 'center',
      gap: (theme) => theme.spacing(1),
      width: '100%',
      height: '100%',
      padding: (theme) => theme.spacing(4),
    }}
  >
    <CircularProgress />

    {message && <Typography align="center">{message}</Typography>}
  </Backdrop>
);

export default Loader;
