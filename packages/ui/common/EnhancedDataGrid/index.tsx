import {
  DataGrid,
  DataGridProps,
  GridToolbarQuickFilterProps,
} from '@mui/x-data-grid';

import { ErrorInfo } from '@indocal/ui';

import {
  EnhancedDataGridLoadingOverlay,
  EnhancedDataGridToolbar,
  EnhancedDataGridNoRowsOverlay,
} from './components';

export interface EnhancedDataGridProps
  extends Omit<DataGridProps, 'components' | 'slotProps'> {
  quickFilterProps?: GridToolbarQuickFilterProps;
  error?: Error | null;
}

export const EnhancedDataGrid: React.FC<EnhancedDataGridProps> = ({
  quickFilterProps,
  error,
  ...props
}) => {
  return (
    <>
      {error && <ErrorInfo error={error} />}

      {!error && (
        <DataGrid
          components={{
            LoadingOverlay: EnhancedDataGridLoadingOverlay,
            NoRowsOverlay: EnhancedDataGridNoRowsOverlay,
            NoResultsOverlay: EnhancedDataGridNoRowsOverlay,
            Toolbar: () => (
              <EnhancedDataGridToolbar quickFilterProps={quickFilterProps} />
            ),
          }}
          {...props}
        />
      )}
    </>
  );
};

export default EnhancedDataGrid;
