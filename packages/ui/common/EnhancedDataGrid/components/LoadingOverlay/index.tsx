import { LinearProgress } from '@mui/material';
import { GridLoadingOverlay, useGridApiContext } from '@mui/x-data-grid';

export const EnhancedDataGridLoadingOverlay: React.FC = () => {
  const { current } = useGridApiContext();

  return current.getRowsCount() ? <LinearProgress /> : <GridLoadingOverlay />;
};

export default EnhancedDataGridLoadingOverlay;
