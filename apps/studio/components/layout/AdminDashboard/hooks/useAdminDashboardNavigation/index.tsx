import { useMemo } from 'react';
import {
  Dashboard as OverviewIcon,
  ManageAccounts as UsersPanelControl,
  Groups as UsersIcon,
  AccountTree as RolesIcon,
  GroupWork as GroupsIcon,
  Feed as FormsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import {
  DrawerNavigation,
  DrawerNavigationItem,
  DrawerNavigationMenu,
} from '@indocal/ui';

import { Pages } from '@/config';

type Navigation =
  | {
      type: 'MENU';
      menu: Omit<DrawerNavigationMenu, 'items'> & {
        items: (DrawerNavigationItem & {
          show: boolean;
        })[];
      };
    }
  | {
      type: 'ITEM';
      item: DrawerNavigationItem & {
        show: boolean;
      };
    };

export function useAdminDashboardNavigation(): DrawerNavigation[] {
  const navigation = useMemo<Navigation[]>(
    () => [
      {
        type: 'ITEM',
        item: {
          show: true,
          label: 'Resumen',
          icon: <OverviewIcon />,
          href: Pages.ROOT,
        },
      },
      {
        type: 'ITEM',
        item: {
          show: true,
          label: 'Formularios',
          icon: <FormsIcon />,
          href: Pages.FORMS,
        },
      },
      {
        type: 'MENU',
        menu: {
          label: 'Control de usuarios',
          icon: <UsersPanelControl />,
          items: [
            {
              show: true,
              label: 'Usuarios',
              icon: <UsersIcon />,
              href: Pages.USERS,
            },
            {
              show: true,
              label: 'Roles / Permisos',
              icon: <RolesIcon />,
              href: Pages.USERS_ROLES,
            },
            {
              show: true,
              label: 'Grupos',
              icon: <GroupsIcon />,
              href: Pages.USERS_GROUPS,
            },
          ],
        },
      },
      {
        type: 'ITEM',
        item: {
          show: true,
          label: 'Configuración',
          icon: <SettingsIcon />,
          href: Pages.SETTINGS,
        },
      },
    ],
    []
  );

  return navigation
    .filter((navigation) =>
      navigation.type === 'MENU'
        ? navigation.menu.items.some((item) => item.show)
        : navigation.item.show
    )
    .map<DrawerNavigation>((navigation) =>
      navigation.type === 'ITEM'
        ? {
            type: 'ITEM',
            value: {
              label: navigation.item.label,
              icon: navigation.item.icon,
              href: navigation.item.href,
            },
          }
        : {
            type: 'MENU',
            value: {
              label: navigation.menu.label,
              icon: navigation.menu.icon,
              items: navigation.menu.items
                .filter((item) => item.show)
                .map((item) => ({
                  label: item.label,
                  icon: item.icon,
                  href: item.href,
                })),
            },
          }
    );
}

export default useAdminDashboardNavigation;
