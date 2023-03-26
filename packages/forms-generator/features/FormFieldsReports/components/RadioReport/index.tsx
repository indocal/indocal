import { useMemo } from 'react';
import {
  Paper,
  Stack,
  Divider,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Typography,
  Chip,
} from '@mui/material';

import { Chart, ChartSeries, ChartOptions } from '@indocal/ui';
import {
  translateFormFieldType,
  FormFieldReport,
  RadioFormFieldReport,
} from '@indocal/services';

export interface RadioReportProps {
  report: FormFieldReport;
}

export const RadioReport: React.FC<RadioReportProps> = ({ report }) => {
  const content = useMemo(
    () => report.content as RadioFormFieldReport,
    [report]
  );

  const options: ChartOptions = useMemo(
    () => ({
      chart: {
        id: RadioReport.name + report.field.id,
        toolbar: { show: true },
      },
      title: {
        style: {
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          fontWeight: 500,
        },
      },
      labels: Object.keys(content)
        .filter((key) => key !== 'na')
        .concat('No respondido'),
    }),
    [report.field.id, content]
  );

  const series: ChartSeries = useMemo(
    () =>
      Object.entries(content)
        .filter(([key]) => key !== 'na')
        .map(([, value]) => value)
        .concat(content.na),
    [content]
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
          <List
            component={Paper}
            sx={{ width: '100%', maxHeight: 250, overflow: 'auto' }}
          >
            <ListSubheader
              disableSticky
              sx={{ backgroundColor: (th) => th.palette.background.paper }}
            >
              Resumen
            </ListSubheader>

            {Object.entries(content)
              .filter(([key]) => key !== 'na')
              .concat([['No respondido', content.na]])
              .map(([key, value]) => (
                <ListItem key={key} dense divider>
                  <ListItemText primary={key} secondary={value} />
                </ListItem>
              ))}
          </List>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default RadioReport;
