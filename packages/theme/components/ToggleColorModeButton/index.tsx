import {
  Tooltip,
  IconButton,
  TooltipProps,
  IconButtonProps,
  SvgIconProps,
} from '@mui/material';
import {
  RestartAlt as SystemModeIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';

import { useUserThemePreferences } from '../../context';

export interface ToggleColorModeButtonProps {
  tooltipProps?: TooltipProps;
  iconButtonProps?: IconButtonProps;
  iconProps?: SvgIconProps;
}

export const ToggleColorModeButton: React.FC<ToggleColorModeButtonProps> = ({
  tooltipProps,
  iconButtonProps,
  iconProps,
}) => {
  const { colorMode, toggleColorMode } = useUserThemePreferences();

  return (
    <Tooltip
      title={
        colorMode === 'system'
          ? 'Cambiar a tema claro'
          : colorMode === 'light'
          ? 'Cambiar a tema oscuro'
          : 'Cambiar a tema definido por el sistema'
      }
      {...tooltipProps}
    >
      <IconButton
        color="inherit"
        onClick={toggleColorMode}
        {...iconButtonProps}
      >
        {colorMode === 'system' ? (
          <LightModeIcon {...iconProps} />
        ) : colorMode === 'light' ? (
          <DarkModeIcon {...iconProps} />
        ) : (
          <SystemModeIcon {...iconProps} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ToggleColorModeButton;
