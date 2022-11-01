import { GridOverlay, useGridApiContext } from '@mui/x-data-grid';

import { UnexpectedError } from '@indocal/utils';

import ErrorInfo from '../../../ErrorInfo';

export const EnhancedDataGridErrorOverlay: React.FC = () => {
  const { current } = useGridApiContext();

  return (
    <GridOverlay sx={{ width: '100%', height: '100%' }}>
      <ErrorInfo
        error={
          current.state.error instanceof Error
            ? current.state.error
            : new UnexpectedError()
        }
      />
    </GridOverlay>
  );
};

export default EnhancedDataGridErrorOverlay;
