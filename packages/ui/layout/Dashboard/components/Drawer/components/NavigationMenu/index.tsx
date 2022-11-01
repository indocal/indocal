import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

import { useDashboard } from '../../../../context';
import { DrawerNavigationMenu } from '../../types';

import { DashboardDrawerNavigationItem } from '../NavigationItem';

export interface DashboardDrawerNavigationMenuProps {
  menu: DrawerNavigationMenu;
  rootPaths?: string[];
}

export const DashboardDrawerNavigationMenu: React.FC<
  DashboardDrawerNavigationMenuProps
> = ({ menu }) => {
  const router = useRouter();

  const { isDrawerOpen } = useDashboard();

  const [open, setOpen] = useState(true);

  const isCurrentMenu = useMemo<boolean>(
    () => menu.items.some((item) => router.asPath.startsWith(item.href)),
    [menu.items, router.asPath]
  );

  return isDrawerOpen ? (
    <List disablePadding>
      <ListItemButton
        selected={isCurrentMenu}
        onClick={() => setOpen((prevState) => !prevState)}
        sx={{
          margin: (theme) => theme.spacing(0.5, 1),
          borderRadius: (theme) => theme.spacing(1),
        }}
      >
        <ListItemIcon
          sx={{
            display: 'flex',
            minWidth: 'fit-content',
            marginRight: (theme) => theme.spacing(2),
            color: 'inherit',
          }}
        >
          {menu.icon}
        </ListItemIcon>

        {isDrawerOpen && (
          <>
            <ListItemText sx={{ color: 'inherit' }}>{menu.label}</ListItemText>

            {open ? <ExpandLess /> : <ExpandMore />}
          </>
        )}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {menu.items.map((item) => (
            <DashboardDrawerNavigationItem
              key={item.label}
              item={item}
              nested={isDrawerOpen}
            />
          ))}
        </List>
      </Collapse>
    </List>
  ) : (
    <List disablePadding>
      {menu.items.map((item) => (
        <DashboardDrawerNavigationItem
          key={item.label}
          item={item}
          nested={isDrawerOpen}
        />
      ))}
    </List>
  );
};

export default DashboardDrawerNavigationMenuProps;
