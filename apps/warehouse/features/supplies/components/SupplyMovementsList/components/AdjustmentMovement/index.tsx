import {
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  HomeRepairService as AdjustmentIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

import { InventoryMovement } from '@indocal/services';

export interface AdjustmentMovementProps {
  movement: InventoryMovement;
  item: InventoryMovement['items'][number];
}

export const AdjustmentMovement: React.FC<AdjustmentMovementProps> = ({
  movement,
  item,
}) => (
  <ListItem dense divider>
    <Tooltip title={movement.concept}>
      <ListItemIcon>
        <Badge variant="dot" color="info" invisible={!movement.concept}>
          <AdjustmentIcon htmlColor="purple" />
        </Badge>
      </ListItemIcon>
    </Tooltip>

    <ListItemText
      primary={new Date(movement.createdAt).toLocaleString()}
      secondary={`(${item.quantity}) Ajustes al sistema`}
    />

    <ListItemSecondaryAction>
      <IconButton size="small">
        <PrintIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

export default AdjustmentMovement;
