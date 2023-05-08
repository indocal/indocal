import {
  Cancel as CancelIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { ConfirmProvider as MaterialConfirmProvider } from 'material-ui-confirm';

export const ConfirmProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <MaterialConfirmProvider
    defaultOptions={{
      dialogProps: { maxWidth: 'xs' },
      contentProps: { dividers: true },

      cancellationText: 'Cancelar',
      cancellationButtonProps: {
        variant: 'contained',
        size: 'small',
        color: 'error',
        endIcon: <CancelIcon fontSize="small" />,
      },

      confirmationText: 'Aceptar',
      confirmationButtonProps: {
        variant: 'contained',
        size: 'small',
        color: 'primary',
        endIcon: <CheckIcon fontSize="small" />,
      },
    }}
  >
    {children}
  </MaterialConfirmProvider>
);

export default ConfirmProvider;
