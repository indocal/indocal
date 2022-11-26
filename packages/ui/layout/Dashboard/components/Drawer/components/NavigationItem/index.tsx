import { useMemo } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Link as MuiLink,
  useTheme,
} from '@mui/material';

import { useDashboard } from '../../../../context';
import { DrawerNavigationItem } from '../../types';

export interface DashboardDrawerNavigationItemProps {
  item: DrawerNavigationItem;
  nested?: boolean;
  rootPaths?: string[];
}

export const DashboardDrawerNavigationItem: React.FC<
  DashboardDrawerNavigationItemProps
> = ({ item, nested, rootPaths }) => {
  const theme = useTheme();

  const router = useRouter();

  const { isDrawerOpen, drawerPosition } = useDashboard();

  const isCurrentPath = useMemo<boolean>(
    () =>
      rootPaths
        ? rootPaths.some((rootPath) => router.asPath === rootPath)
          ? router.asPath === item.href
          : router.asPath.startsWith(item.href) &&
            rootPaths.every((rootPath) => rootPath !== item.href)
        : router.asPath.startsWith(item.href),
    [item.href, rootPaths, router.asPath]
  );

  const textColor = useMemo(
    () =>
      nested && !isCurrentPath
        ? theme.palette.text.disabled
        : isCurrentPath
        ? theme.palette.secondary.main
        : 'inherit',
    [
      nested,
      isCurrentPath,
      theme.palette.secondary.main,
      theme.palette.text.disabled,
    ]
  );

  return (
    <MuiLink
      component={NextLink}
      href={item.href}
      color="inherit"
      underline="none"
    >
      <Tooltip
        title={!isDrawerOpen ? item.label : ''}
        placement={drawerPosition === 'left' ? 'right' : 'left'}
      >
        <ListItemButton
          sx={{
            borderRadius: (theme) => theme.spacing(1),
            ...(isDrawerOpen && {
              margin: (theme) => theme.spacing(0.5, 1),
            }),
            ...(!isDrawerOpen && {
              padding: (theme) => theme.spacing(1.5, 2),
            }),
            ...(nested && {
              margin: (theme) => theme.spacing(0.5, 2),
            }),
          }}
        >
          <ListItemIcon
            sx={{
              display: 'flex',
              minWidth: 'fit-content',
              marginRight: (theme) => theme.spacing(2),
              color: textColor,
            }}
          >
            {item.icon}
          </ListItemIcon>

          {isDrawerOpen && (
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                sx: {
                  color: textColor,
                  ...(nested && {
                    fontSize: (theme) => theme.typography.caption,
                  }),
                  ...(isCurrentPath && {
                    fontWeight: 'bolder',
                  }),
                },
              }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    </MuiLink>
  );
};

export default DashboardDrawerNavigationItem;
