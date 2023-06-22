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
  SectionFormFieldItemReport,
  CheckboxFormFieldReport,
} from '@indocal/services';

export interface CheckboxItemReportProps {
  report: SectionFormFieldItemReport;
}

export const CheckboxItemReport: React.FC<CheckboxItemReportProps> = ({
  report,
}) => {
  const content = useMemo(
    () => report.content as CheckboxFormFieldReport,
    [report]
  );

  const options: ChartOptions = useMemo(
    () => ({
      chart: {
        id: CheckboxItemReport.name + report.item.title,
        toolbar: { show: true },
      },
      title: {
        style: {
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          fontWeight: 500,
        },
      },
      labels: ['Sí', 'No', 'No respondido'],
    }),
    [report.item.title]
  );

  const series: ChartSeries = useMemo(
    () => [content.yes, content.no, content.na],
    [content.yes, content.no, content.na]
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
          sx={{ width: '100%' }}
        >
          <List component={Paper} sx={{ width: '100%' }}>
            <ListSubheader
              disableSticky
              sx={{ backgroundColor: (th) => th.palette.background.paper }}
            >
              Resumen
            </ListSubheader>

            <ListItem dense divider>
              <ListItemText primary="Sí" secondary={content.yes} />
            </ListItem>

            <ListItem dense divider>
              <ListItemText primary="No" secondary={content.no} />
            </ListItem>

            <ListItem dense divider>
              <ListItemText primary="No respondido" secondary={content.na} />
            </ListItem>
          </List>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CheckboxItemReport;
