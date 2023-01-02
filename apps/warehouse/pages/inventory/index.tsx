import { Container } from '@mui/material';

import { Page } from '@indocal/ui';

import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const InventoryPage: EnhancedNextPage = () => (
  <Page title="Inventario" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }} />
  </Page>
);

InventoryPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default InventoryPage;
