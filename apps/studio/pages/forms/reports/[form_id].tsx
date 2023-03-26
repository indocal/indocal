import { useRouter } from 'next/router';
import { Container, Grid, Typography } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useForm, UUID } from '@indocal/services';

import {
  FormCard,
  FormEntriesPerMonthChart,
  FormFieldsReportsPerCycle,
} from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const FormReportsPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { loading, form, error } = useForm(router.query.form_id as UUID);

  return (
    <Page
      transition="right"
      title={
        loading
          ? 'Cargando...'
          : form
          ? `Formulario: ${form.title}`
          : 'Formulario no encontrado'
      }
    >
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : form ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={12} md={4}>
              <Widget>
                <FormCard form={form} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={8}>
              <Widget>
                <FormEntriesPerMonthChart form={form} />
              </Widget>
            </Grid>

            <Grid item xs={12}>
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
                Reportes
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Widget disableDefaultSizes>
                <FormFieldsReportsPerCycle form={form} />
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

FormReportsPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default FormReportsPage;
