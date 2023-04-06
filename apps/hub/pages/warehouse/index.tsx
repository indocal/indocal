import { useSession } from 'next-auth/react';
import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget } from '@indocal/ui';
import { UUID } from '@indocal/services';

import { UserSuppliesRequestsDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const WarehousePage: EnhancedNextPage = () => {
  const { data: session } = useSession();

  return (
    <Page title="Almacén & Suministro" transition="down">
      <Container
        fixed
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '1fr',
          paddingY: (theme) => theme.spacing(2),
        }}
      >
        <Unstable_Grid2
          container
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ height: 'fit-content' }}
        >
          <Unstable_Grid2 xs={12}>
            <Widget height={500}>
              <UserSuppliesRequestsDataGrid user={session?.user.id as UUID} />
            </Widget>
          </Unstable_Grid2>
        </Unstable_Grid2>
      </Container>
    </Page>
  );
};

WarehousePage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default WarehousePage;
