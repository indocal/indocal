import { useMemo } from 'react';
import { Dashboard as OverviewIcon } from '@mui/icons-material';

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
