import { Container } from '@mui/material';

import { Page } from '@indocal/ui';

import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const WarehousePage: EnhancedNextPage = () => (
  <Page title="Almacén & Suministro" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}></Container>
  </Page>
);

WarehousePage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default WarehousePage;
