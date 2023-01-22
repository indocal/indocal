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
  SwapHoriz as TransferIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

import { InventoryMovement } from '@indocal/services';

export interface TransferMovementProps {
  movement: InventoryMovement;
  item: InventoryMovement['items'][number];
}

export const TransferMovement: React.FC<TransferMovementProps> = ({
  movement,
  item,
}) => (
  <ListItem dense divider>
    <Tooltip title={movement.concept}>
      <ListItemIcon>
        <Badge variant="dot" color="info" invisible={!movement.concept}>
          <TransferIcon color="info" />
        </Badge>
      </ListItemIcon>
    </Tooltip>

    <ListItemText
      primary={new Date(movement.createdAt).toLocaleString()}
      secondary={`(${item.quantity}) ${movement.origin?.username} -> ${movement.destination?.username}`}
    />

    <ListItemSecondaryAction>
      <IconButton size="small">
        <PrintIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

export default TransferMovement;
