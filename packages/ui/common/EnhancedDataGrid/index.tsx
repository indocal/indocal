import {
  DataGrid,
  DataGridProps,
  GridToolbarQuickFilterProps,
} from '@mui/x-data-grid';

import {
  EnhancedDataGridLoadingOverlay,
  EnhancedDataGridToolbar,
  EnhancedDataGridNoRowsOverlay,
  EnhancedDataGridErrorOverlay,
} from './components';

export interface EnhancedDataGridProps
  extends Omit<DataGridProps, 'components' | 'componentsProps'> {
  quickFilterProps?: GridToolbarQuickFilterProps;
}

export const EnhancedDataGrid: React.FC<EnhancedDataGridProps> = ({
  quickFilterProps,
  ...props
}) => (
  <DataGrid
    components={{
      LoadingOverlay: EnhancedDataGridLoadingOverlay,
      NoRowsOverlay: EnhancedDataGridNoRowsOverlay,
      NoResultsOverlay: EnhancedDataGridNoRowsOverlay,
      ErrorOverlay: EnhancedDataGridErrorOverlay,
      Toolbar: () => (
        <EnhancedDataGridToolbar quickFilterProps={quickFilterProps} />
      ),
    }}
    {...props}
  />
);

export default EnhancedDataGrid;
