import { useMemo } from 'react';
import {
  Paper,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  Typography,
  LinearProgress,
} from '@mui/material';
import {
  Print as PrintIcon,
  AssignmentReturned as InputIcon,
  AssignmentReturn as OutputIcon,
  SwapHoriz as SwapIcon,
  VolunteerActivism as DiscardIcon,
} from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { useSupply, UUID, Supply, SupplyMovementType } from '@indocal/services';

import {
  AdjustmentMovement,
  InputMovement,
  OutputMovement,
  TransferMovement,
  DischargeMovement,
} from './components';

export interface SupplyMovementsListProps {
  supply: UUID | Supply;
}

export const SupplyMovementsList: React.FC<SupplyMovementsListProps> = ({
  supply: entity,
}) => {
  const { loading, validating, supply, error } = useSupply(
    typeof entity === 'string' ? entity : entity.id
  );

  const;

  return (
    <Paper
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {loading ? (
        <Loader invisible message="Cargando grupos..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : supply ? (
        <>
          {validating && (
            <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: (theme) => theme.zIndex.modal - 1,
                width: '100%',
                borderTopLeftRadius: (theme) => theme.shape.borderRadius,
                borderTopRightRadius: (theme) => theme.shape.borderRadius,
              }}
            />
          )}

          <List
            disablePadding
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          >
            <ListSubheader
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: (theme) => theme.spacing(1),
                padding: (theme) => theme.spacing(1.5, 2),
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" fontWeight="bolder">
                Movimientos
              </Typography>
            </ListSubheader>

            {supply ? (
              <></>
            ) : (
              <NoData message="El recurso no presenta movimientos" />
            )}
          </List>
        </>
      ) : (
        <NoData message="No se han encontrado movimientos del recurso" />
      )}
    </Paper>
  );
};

export default SupplyMovementsList;
