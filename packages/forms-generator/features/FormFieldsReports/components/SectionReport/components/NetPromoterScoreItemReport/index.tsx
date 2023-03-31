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
import {
  SentimentVeryDissatisfied as SentimentVeryDissatisfiedIcon,
  SentimentDissatisfied as SentimentDissatisfiedIcon,
  SentimentSatisfied as SentimentSatisfiedIcon,
  SentimentSatisfiedAltOutlined as SentimentSatisfiedAltIcon,
  SentimentVerySatisfied as SentimentVerySatisfiedIcon,
} from '@mui/icons-material';

import { Chart, ChartSeries, ChartOptions } from '@indocal/ui';
import {
  translateFormFieldType,
  SectionFormFieldItemReport,
  NetPromoterScoreFormFieldReport,
} from '@indocal/services';

export interface NetPromoterScoreItemReportProps {
  report: SectionFormFieldItemReport;
}

export const NetPromoterScoreItemReport: React.FC<
  NetPromoterScoreItemReportProps
> = ({ report }) => {
  const content = useMemo(
    () => report.content as NetPromoterScoreFormFieldReport,
    [report]
  );

  const options: ChartOptions = useMemo(
    () => ({
      chart: {
        id: NetPromoterScoreItemReport.name + report.item.title,
        toolbar: { show: true },
      },
      title: {
        style: {
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          fontWeight: 500,
        },
      },
      labels: [
        'Satisfecho',
        'Poco Satisfecho',
        'Insatisfecho',
        'No respondido',
      ],
    }),
    [report.item.title]
  );

  const series: ChartSeries = useMemo(
    () => [content.positive, content.neutral, content.negative, content.na],
    [content.positive, content.neutral, content.negative, content.na]
  );

  const icons: Record<number, React.ReactElement> = useMemo(
    () => ({
      1: <SentimentVeryDissatisfiedIcon color="error" />,
      2: <SentimentDissatisfiedIcon color="error" />,
      3: <SentimentSatisfiedIcon color="warning" />,
      4: <SentimentSatisfiedAltIcon color="success" />,
      5: <SentimentVerySatisfiedIcon color="success" />,
    }),
    []
  );

  const nfs = useMemo(
    () =>
      Math.round(
        (content.positive * 5 + content.neutral * 3 + content.negative * 1) /
          (content.positive + content.neutral + content.negative)
      ),
    [content.positive, content.neutral, content.negative]
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
            Satisfacción promedio
          </Typography>

          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Rating
              readOnly
              highlightSelectedOnly
              value={nfs}
              IconContainerComponent={({ value, ...rest }) => (
                <span {...rest}>{icons[value]}</span>
              )}
              sx={{
                '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
                  color: (theme) => theme.palette.action.disabled,
                },
              }}
            />
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default NetPromoterScoreItemReport;
