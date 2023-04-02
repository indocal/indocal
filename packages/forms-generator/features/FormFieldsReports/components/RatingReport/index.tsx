import { useMemo } from 'react';
import {
  Paper,
  Stack,
  Divider,
  Grid,
  Typography,
  Chip,
  Rating,
} from '@mui/material';

import { Chart, ChartSeries, ChartOptions } from '@indocal/ui';
import {
  translateFormFieldType,
  FormFieldReport,
  RatingFormFieldReport,
  RatingFormFieldConfig,
} from '@indocal/services';

export interface RatingReportProps {
  report: FormFieldReport;
}

export const RatingReport: React.FC<RatingReportProps> = ({ report }) => {
  const config = useMemo(
    () => report.field.config as RatingFormFieldConfig,
    [report]
  );

  const content = useMemo(
    () => report.content as RatingFormFieldReport,
    [report]
  );

  const options: ChartOptions = useMemo(
    () => ({
      chart: {
        id: RatingReport.name + report.field.id,
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
          <Chart type="pie" height={200} series={series} options={options} />
        </Stack>

        <Stack
          flex={{ md: 1 }}
          justifyContent="center"
          alignItems="center"
          spacing={0.5}
        >
          <Typography variant="h6" align="center">
            Puntación promedio
          </Typography>

          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Rating readOnly max={config?.levels} value={content.average} />
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default RatingReport;