import { useRouter } from 'next/router';
import { Container, Grid } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useFormEntry, getShortUUID, UUID } from '@indocal/services';

import {
  FormEntryCard,
  FormEntryAnswers,
  FormCard,
  UserCard,
} from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const FormEntryPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { loading, entry, error } = useFormEntry(router.query.entry_id as UUID);

  return (
    <Page
      transition="right"
      title={
        loading
          ? 'Cargando...'
          : entry
          ? `Entrada: ${getShortUUID(entry.id)}`
          : 'Entrada no encontrada'
      }
    >
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : entry ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={12} md={4}>
              <Widget>
                <FormEntryCard entry={entry} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={4}>
              <Widget>
                <FormCard form={entry.form.id} />
              </Widget>
            </Grid>

            {entry.answeredBy && (
              <Grid item xs={12} md={4}>
                <Widget>
                  <UserCard user={entry.answeredBy.id} />
                </Widget>
              </Grid>
            )}

            <Grid item xs={12}>
              <Widget disableDefaultSizes>
                <FormEntryAnswers entry={entry} />
              </Widget>
            </Grid>
          </Grid>
        ) : (
          <NotFound />
        )}
      </Container>
    </Page>
  );
};

FormEntryPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default FormEntryPage;
