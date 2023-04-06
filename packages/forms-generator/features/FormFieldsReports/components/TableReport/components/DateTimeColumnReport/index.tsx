import { useMemo } from 'react';
import {
  Paper,
  Stack,
  Divider,
  Unstable_Grid2,
  Typography,
  Chip,
} from '@mui/material';

import { Chart, ChartSeries, ChartOptions } from '@indocal/ui';
import {
  translateFormFieldType,
  TableFormFieldColumnReport,
  DateTimeFormFieldReport,
} from '@indocal/services';

export interface DateTimeColumnReportProps {
  report: TableFormFieldColumnReport;
}

export const DateTimeColumnReport: React.FC<DateTimeColumnReportProps> = ({
  report,
}) => {
  const content = useMemo(
    () => report.content as DateTimeFormFieldReport,
    [report]
  );

  const options: ChartOptions = useMemo(
    () => ({
      chart: {
        id: DateTimeColumnReport.name + report.column.heading,
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
    [report.column.heading]
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
          <Typography variant="h6">{report.column.heading}</Typography>
        </Stack>

        <Chip label={translateFormFieldType(report.column.type)} />
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        divider={<Divider flexItem />}
      >
        <Stack flex={{ md: 1 }}>
          <Chart type="pie" height={200} series={series} options={options} />
        </Stack>

        <Stack
          flex={{ md: 1 }}
          justifyContent="center"
          alignItems="center"
          spacing={0.5}
        >
          <Typography variant="h6" align="center">
            Ultimas respuestas
          </Typography>

          <Unstable_Grid2
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            {content.lastAnswers.map((answer, index) => (
              <Unstable_Grid2 key={`${answer}-${index}`}>
                <Chip
                  label={new Date(answer).toLocaleString()}
                  sx={{ fontStyle: 'italic' }}
                />
              </Unstable_Grid2>
            ))}
          </Unstable_Grid2>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DateTimeColumnReport;
