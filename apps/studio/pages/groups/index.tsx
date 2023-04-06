import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget } from '@indocal/ui';

import { UsersGroupsDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const UsersGroupsPage: EnhancedNextPage = () => (
  <Page title="Grupos" transition="down">
    <Container
      fixed
      sx={{
        display: 'grid',
        placeContent: 'start',
        paddingY: (theme) => theme.spacing(2),
      }}
    >
      <Unstable_Grid2 container spacing={1}>
        <Unstable_Grid2 xs={12}>
          <Widget height={500}>
            <UsersGroupsDataGrid />
          </Widget>
        </Unstable_Grid2>
      </Unstable_Grid2>
    </Container>
  </Page>
);

UsersGroupsPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default UsersGroupsPage;
