import { useSession } from 'next-auth/react';
import { Container } from '@mui/material';

import { Page, Widget } from '@indocal/ui';
import { UUID } from '@indocal/services';

import { UserSuppliesRequestsDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const WarehousePage: EnhancedNextPage = () => {
  const { data: session } = useSession();

  return (
    <Page title="Almacén & Suministro" transition="down">
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        <Widget height={500}>
          <UserSuppliesRequestsDataGrid user={session?.user.id as UUID} />
        </Widget>
      </Container>
    </Page>
  );
};

WarehousePage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default WarehousePage;
