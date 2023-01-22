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
  AssignmentReturned as InputIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

import { InventoryMovement } from '@indocal/services';

export interface InputMovementProps {
  movement: InventoryMovement;
  item: InventoryMovement['items'][number];
}

export const InputMovement: React.FC<InputMovementProps> = ({
  movement,
  item,
}) => (
  <ListItem dense divider>
    <Tooltip title={movement.concept}>
      <ListItemIcon>
        <Badge variant="dot" color="info" invisible={!movement.concept}>
          <InputIcon color="success" />
        </Badge>
      </ListItemIcon>
    </Tooltip>

    <ListItemText
      primary={new Date(movement.createdAt).toLocaleString()}
      secondary={`(${item.quantity}) ${movement.order?.supplier.name} -> Almacén`}
    />

    <ListItemSecondaryAction>
      <IconButton size="small">
        <PrintIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

export default InputMovement;
