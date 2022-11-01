import {
  Tooltip,
  IconButton,
  TooltipProps,
  IconButtonProps,
  SvgIconProps,
} from '@mui/material';
import {
  BorderLeft as BorderLeftIcon,
  BorderRight as BorderRightIcon,
} from '@mui/icons-material';

import { useDashboard } from '../../context';

export interface ToggleDrawerPositionButtonProps {
  tooltipProps?: TooltipProps;
  iconButtonProps?: IconButtonProps;
  iconProps?: SvgIconProps;
}

export const ToggleDrawerPositionButton: React.FC<
  ToggleDrawerPositionButtonProps
> = ({ tooltipProps, iconButtonProps, iconProps }) => {
  const { drawerPosition, toggleDrawerPosition } = useDashboard();

  return (
    <Tooltip
      title={
        drawerPosition === 'left'
          ? 'Mover navegación a la derecha'
          : 'Mover navegación a la izquierda'
      }
      {...tooltipProps}
    >
      <IconButton
        color="inherit"
        onClick={toggleDrawerPosition}
        {...iconButtonProps}
      >
        {drawerPosition === 'left' ? (
          <BorderRightIcon {...iconProps} />
        ) : (
          <BorderLeftIcon {...iconProps} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ToggleDrawerPositionButton;
