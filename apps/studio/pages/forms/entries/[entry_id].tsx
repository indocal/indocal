import { useRouter } from 'next/router';
import { Container, Unstable_Grid2, Typography } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { FormEntryAnswers } from '@indocal/forms-generator';
import { useFormEntry, getShortUUID, UUID } from '@indocal/services';

import { FormEntryCard, FormCard, UserCard } from '@/features';
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
      <Container
        fixed
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '1fr',
          paddingY: (theme) => theme.spacing(2),
        }}
      >
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : entry ? (
          <Unstable_Grid2
            container
            justifyContent="center"
            alignItems="flex-start"
            spacing={1}
            sx={{ height: 'fit-content' }}
          >
            <Unstable_Grid2 xs={12} md={entry.answeredBy ? 4 : 6}>
              <Widget>
                <FormEntryCard entry={entry} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={entry.answeredBy ? 4 : 6}>
              <Widget>
                <FormCard form={entry.form.id} />
              </Widget>
            </Unstable_Grid2>

            {entry.answeredBy && (
              <Unstable_Grid2 xs={12} md={4}>
                <Widget>
                  <UserCard user={entry.answeredBy.id} />
                </Widget>
              </Unstable_Grid2>
            )}

            <Unstable_Grid2 xs={12}>
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  margin: (theme) => theme.spacing(4),
                  alignItems: 'center',
                  '::before': {
                    content: '""',
                    flexGrow: 1,
                    marginRight: (theme) => theme.spacing(2),
                    borderBottom: (theme) =>
                      `1px solid ${theme.palette.divider}`,
                  },
                  '::after': {
                    content: '""',
                    flexGrow: 1,
                    marginLeft: (theme) => theme.spacing(2),
                    borderBottom: (theme) =>
                      `1px solid ${theme.palette.divider}`,
                  },
                }}
              >
                Datos capturados en el formulario
              </Typography>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12}>
              <Widget disableDefaultSizes>
                <FormEntryAnswers answers={entry.answers} />
              </Widget>
            </Unstable_Grid2>
          </Unstable_Grid2>
        ) : (
          <NotFound />
        )}
      </Container>
    </Page>
  );
};

FormEntryPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default FormEntryPage;
