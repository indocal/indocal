import { useMemo } from 'react';
import {
  Dashboard as OverviewIcon,
  Feed as FormsIcon,
  SnippetFolder as UploadsIcon,
  ManageAccounts as UsersPanelControl,
  Groups as UsersIcon,
  AccountTree as RolesIcon,
  GroupWork as GroupsIcon,
  History as LogsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import {
  DrawerNavigation,
  DrawerNavigationItem,
  DrawerNavigationMenu,
} from '@indocal/ui';
import { useAbility } from '@indocal/services';

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
  const ability = useAbility();

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
          show: ability.can('read', 'form'),
          label: 'Formularios',
          icon: <FormsIcon />,
          href: Pages.FORMS,
        },
      },
      {
        type: 'ITEM',
        item: {
          show: ability.can('read', 'file') && ability.can('read', 'folder'),
          label: 'Librería de archivos',
          icon: <UploadsIcon />,
          href: Pages.UPLOADS,
        },
      },
      {
        type: 'MENU',
        menu: {
          label: 'Control de usuarios',
          icon: <UsersPanelControl />,
          items: [
            {
              show: ability.can('read', 'user'),
              label: 'Usuarios',
              icon: <UsersIcon />,
              href: Pages.USERS,
            },
            {
              show: ability.can('read', 'userRole'),
              label: 'Roles / Permisos',
              icon: <RolesIcon />,
              href: Pages.USERS_ROLES,
            },
            {
              show: ability.can('read', 'userGroup'),
              label: 'Grupos',
              icon: <GroupsIcon />,
              href: Pages.USERS_GROUPS,
            },
            {
              show: ability.can('read', 'log'),
              label: 'Registros',
              icon: <LogsIcon />,
              href: Pages.LOGS,
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
    [ability]
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
