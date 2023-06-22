import { useMemo } from 'react';
import { Paper, Stack, Divider, Typography, Chip } from '@mui/material';

import { NoData, Chart, ChartSeries, ChartOptions } from '@indocal/ui';
import {
  translateFormFieldType,
  SectionFormFieldItemReport,
  UsersFormFieldReport,
} from '@indocal/services';

import { LastUsersAnswers } from './components';

export interface UsersItemReportProps {
  report: SectionFormFieldItemReport;
}

export const UsersItemReport: React.FC<UsersItemReportProps> = ({ report }) => {
  const content = useMemo(
    () => report.content as UsersFormFieldReport,
    [report]
  );

  const options: ChartOptions = useMemo(
    () => ({
      chart: {
        id: UsersItemReport.name + report.item.title,
        toolbar: { show: true },
      },
      title: {
        style: {
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          fontWeight: 500,
        },
      },
      labels: ['Respondido', 'No respondido'],
    }),
    [report.item.title]
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
          <Typography variant="h6">{report.item.title}</Typography>

          {report.item.description && (
            <Typography
              component="pre"
              variant="caption"
              color="text.secondary"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {report.item.description}
            </Typography>
          )}
        </Stack>

        <Chip label={translateFormFieldType(report.item.type)} />
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        divider={<Divider flexItem />}
      >
        <Stack flex={{ md: 1 }}>
          <Chart type="pie" height={250} series={series} options={options} />
        </Stack>

        <Stack
          flex={{ md: 1 }}
          justifyContent="center"
          alignItems="center"
          spacing={0.5}
        >
          {content.lastAnswers.length > 0 ? (
            <LastUsersAnswers users={content.lastAnswers} />
          ) : (
            <Paper sx={{ width: '100%', height: '100%' }}>
              <NoData />
            </Paper>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UsersItemReport;
