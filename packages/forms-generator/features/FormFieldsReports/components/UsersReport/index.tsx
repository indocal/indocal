import { useMemo } from 'react';
import { Paper, Stack, Divider, Grid, Typography, Chip } from '@mui/material';

import {
  Loader,
  NotFound,
  ErrorInfo,
  Chart,
  ChartSeries,
  ChartOptions,
} from '@indocal/ui';
import {
  useUsers,
  translateFormFieldType,
  FormFieldReport,
  UsersFormFieldReport,
} from '@indocal/services';

export interface UsersReportProps {
  report: FormFieldReport;
}

export const UsersReport: React.FC<UsersReportProps> = ({ report }) => {
  const content = useMemo(
    () => report.content as UsersFormFieldReport,
    [report]
  );

  const { loading, users, error } = useUsers({
    filters: { id: { in: content.lastAnswers } },
  });

  const options: ChartOptions = useMemo(
    () => ({
      chart: {
        id: UsersReport.name + report.field.id,
        toolbar: { show: true },
      },
      title: {
        text: 'Veces respondido VS Veces no respondido',
        style: {
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          fontWeight: 500,
        },
      },
      labels: ['Respondido', 'No respondido'],
    }),
    [report.field.id]
  );

  const series: ChartSeries = useMemo(
    () => [content.count, content.na],
    [content.count, content.na]
  );

  return (
    <Stack
      component={Paper}
      elevation={2}
      spacing={1}
      divider={<Divider flexItem />}
      sx={{ padding: (theme) => theme.spacing(2) }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={1}
      >
        <Stack>
          <Typography variant="h6">{report.field.title}</Typography>

          {report.field.description && (
            <Typography
              component="pre"
              variant="caption"
              color="text.secondary"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {report.field.description}
            </Typography>
          )}
        </Stack>

        <Chip label={translateFormFieldType(report.field.type)} />
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        divider={<Divider flexItem />}
      >
        <Stack flex={{ md: 1 }}>
          <Chart
            type="pie"
            width={350}
            height={250}
            series={series}
            options={options}
          />
        </Stack>

        <Stack
          flex={{ md: 1 }}
          justifyContent="center"
          alignItems="center"
          spacing={0.5}
        >
          {loading ? (
            <Loader invisible message="Cargando datos..." />
          ) : error ? (
            <ErrorInfo error={error} />
          ) : users.length > 0 ? (
            <>
              <Typography variant="h6" align="center">
                Ultimas respuestas
              </Typography>

              <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={1}
              >
                {users.map((user) => (
                  <Grid key={user.id} item>
                    <Chip label={user.name} sx={{ fontStyle: 'italic' }} />
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <NotFound />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UsersReport;
