import { Dashboard } from '@indocal/ui';

import { Pages } from '@/config';

import {
  AdminDashboardAppBarContent,
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
      appBarContent={<AdminDashboardAppBarContent />}
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
