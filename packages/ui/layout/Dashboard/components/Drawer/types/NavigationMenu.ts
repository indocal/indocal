import DrawerNavigationItem from './NavigationItem';

export type DrawerNavigationMenu = {
  label: string;
  icon: React.ReactElement;
  items: DrawerNavigationItem[];
};

export default DrawerNavigationMenu;
