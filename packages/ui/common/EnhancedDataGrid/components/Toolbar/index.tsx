import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarExport,
  GridToolbarQuickFilterProps,
} from '@mui/x-data-grid';

export interface EnhancedDataGridToolbarProps {
  quickFilterProps?: GridToolbarQuickFilterProps;
}

export const EnhancedDataGridToolbar: React.FC<
  EnhancedDataGridToolbarProps
> = ({ quickFilterProps }) => (
  <GridToolbarContainer
    sx={{
      display: 'flex',
      flexDirection: ['column', 'row'],
      justifyContent: ['center', 'space-between'],
      alignItems: 'center',
      gap: (theme) => theme.spacing(1),
      padding: (theme) => theme.spacing(1),
      borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
    }}
  >
    <GridToolbarExport />

    <GridToolbarQuickFilter
      size="small"
      variant="outlined"
      {...quickFilterProps}
    />
  </GridToolbarContainer>
);

export default EnhancedDataGridToolbar;
