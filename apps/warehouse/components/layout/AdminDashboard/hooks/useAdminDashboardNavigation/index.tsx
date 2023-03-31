import { useMemo } from 'react';
import {
  Dashboard as OverviewIcon,
  Inventory as InventoryIcon,
  LocalShipping as SuppliersIcon,
  LocalMall as OrdersIcon,
  History as InventoryMovementsIcon,
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
          show:
            ability.can('count', 'supply') ||
            ability.can('count', 'supplier') ||
            ability.can('count', 'order') ||
            ability.can('count', 'inventoryMovement'),
          label: 'Resumen',
          icon: <OverviewIcon />,
          href: Pages.ROOT,
        },
      },
      {
        type: 'ITEM',
        item: {
          show: ability.can('read', 'supply'),
          label: 'Inventario',
          icon: <InventoryIcon />,
          href: Pages.SUPPLIES,
        },
      },
      {
        type: 'ITEM',
        item: {
          show: ability.can('read', 'supplier'),
          label: 'Suplidores',
          icon: <SuppliersIcon />,
          href: Pages.SUPPLIERS,
        },
      },
      {
        type: 'ITEM',
        item: {
          show: ability.can('read', 'order'),
          label: 'Ordenes',
          icon: <OrdersIcon />,
          href: Pages.ORDERS,
        },
      },
      {
        type: 'ITEM',
        item: {
          show: ability.can('read', 'inventoryMovement'),
          label: 'Movimientos',
          icon: <InventoryMovementsIcon />,
          href: Pages.INVENTORY_MOVEMENTS,
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
