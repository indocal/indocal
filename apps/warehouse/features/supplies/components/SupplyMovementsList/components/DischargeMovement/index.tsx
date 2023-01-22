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
  SignLanguage as DischargeIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

import { InventoryMovement } from '@indocal/services';

export interface DischargeMovementProps {
  movement: InventoryMovement;
  item: InventoryMovement['items'][number];
}

export const DischargeMovement: React.FC<DischargeMovementProps> = ({
  movement,
  item,
}) => (
  <ListItem dense divider>
    <Tooltip title={movement.concept}>
      <ListItemIcon>
        <Badge variant="dot" color="info" invisible={!movement.concept}>
          <DischargeIcon color="error" />
        </Badge>
      </ListItemIcon>
    </Tooltip>

    <ListItemText
      primary={new Date(movement.createdAt).toLocaleString()}
      secondary={`(${item.quantity}) ${movement.origin?.username}`}
    />

    <ListItemSecondaryAction>
      <IconButton size="small">
        <PrintIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

export default DischargeMovement;
