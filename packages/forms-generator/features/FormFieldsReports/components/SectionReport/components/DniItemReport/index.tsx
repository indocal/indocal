import { useMemo } from 'react';
import {
  Paper,
  Stack,
  Divider,
  Unstable_Grid2,
  Typography,
  Chip,
} from '@mui/material';

import { Chart, ChartSeries, ChartOptions, formatDni } from '@indocal/ui';
import {
  translateFormFieldType,
  SectionFormFieldItemReport,
  DniFormFieldReport,
} from '@indocal/services';

export interface DniItemReportProps {
  report: SectionFormFieldItemReport;
}

export const DniItemReport: React.FC<DniItemReportProps> = ({ report }) => {
  const content = useMemo(() => report.content as DniFormFieldReport, [report]);

  const options: ChartOptions = useMemo(
    () => ({
      chart: {
        id: DniItemReport.name + report.item.title,
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
                  label={formatDni(answer, 'UI')}
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

export default DniItemReport;
