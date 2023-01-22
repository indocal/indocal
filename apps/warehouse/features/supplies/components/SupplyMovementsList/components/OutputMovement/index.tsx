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
  AssignmentReturn as OutputIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

import { InventoryMovement } from '@indocal/services';

export interface OutputMovementProps {
  movement: InventoryMovement;
  item: InventoryMovement['items'][number];
}

export const OutputMovement: React.FC<OutputMovementProps> = ({
  movement,
  item,
}) => (
  <ListItem dense divider>
    <Tooltip title={movement.concept}>
      <ListItemIcon>
        <Badge variant="dot" color="info" invisible={!movement.concept}>
          <OutputIcon color="warning" />
        </Badge>
      </ListItemIcon>
    </Tooltip>

    <ListItemText
      primary={new Date(movement.createdAt).toLocaleString()}
      secondary={`(${item.quantity}) Almacén -> ${movement.destination?.username}`}
    />

    <ListItemSecondaryAction>
      <IconButton size="small">
        <PrintIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

export default OutputMovement;
