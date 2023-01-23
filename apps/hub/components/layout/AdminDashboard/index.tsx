import { Dashboard } from '@indocal/ui';

import { Pages } from '@/config';

import {
  AdminDashboardDrawerHeader,
  AdminDashboardDrawerFooter,
} from './components';
import { useAdminDashboardNavigation } from './hooks';

export const AdminDashboard: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const navigation = useAdminDashboardNavigation();

  return (
    <Dashboard
      drawerHeader={<AdminDashboardDrawerHeader />}
      drawerNavigation={navigation}
      drawerNavigationRootPaths={[Pages.ROOT]}
      drawerFooter={<AdminDashboardDrawerFooter />}
    >
      {children}
    </Dashboard>
  );
};

export default AdminDashboard;
