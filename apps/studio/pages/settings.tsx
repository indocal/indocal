import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget } from '@indocal/ui';

import { AppearanceSettings } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const SettingsPage: EnhancedNextPage = () => (
  <Page title="Configuración" transition="down">
    <Container
      fixed
      sx={{
        display: 'grid',
        placeContent: 'start',
        paddingY: (theme) => theme.spacing(2),
      }}
    >
      <Unstable_Grid2
        container
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Unstable_Grid2 xs={12}>
          <Widget disableDefaultSizes>
            <AppearanceSettings />
          </Widget>
        </Unstable_Grid2>
      </Unstable_Grid2>
    </Container>
  </Page>
);

SettingsPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default SettingsPage;
