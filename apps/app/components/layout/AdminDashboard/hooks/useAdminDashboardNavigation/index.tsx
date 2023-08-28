import { useMemo } from 'react';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ServicesIcon,
  ListAlt as ServicesListIcon,
  History as ServicesHistoryIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import {
  DrawerNavigation,
  DrawerNavigationItem,
  DrawerNavigationMenu,
} from '@indocal/ui';
import { useAppAbility } from '@indocal/services';

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
  const ability = useAppAbility();

  const navigation = useMemo<Navigation[]>(
    () => [
      {
        type: 'ITEM',
        item: {
          show: true,
          label: 'Resumen',
          icon: <DashboardIcon />,
          href: Pages.ROOT,
        },
      },
      {
        type: 'MENU',
        menu: {
          label: 'Servicios',
          icon: <ServicesIcon />,
          items: [
            {
              show: ability.can('read', 'service'),
              label: 'Listado de servicios',
              icon: <ServicesListIcon />,
              href: Pages.SERVICES,
            },
            {
              show: ability.can('read', 'serviceRequest'),
              label: 'Historial de solicitudes',
              icon: <ServicesHistoryIcon />,
              href: Pages.SERVICES_REQUESTS,
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
