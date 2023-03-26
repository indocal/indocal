import { useMemo } from 'react';
import {
  Paper,
  Stack,
  Divider,
  Grid,
  Typography,
  Chip,
  Button,
  Link,
} from '@mui/material';
import {
  FilePresent as FileIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
} from '@mui/icons-material';

import {
  Loader,
  NotFound,
  ErrorInfo,
  Chart,
  ChartSeries,
  ChartOptions,
} from '@indocal/ui';
import {
  useFiles,
  translateFormFieldType,
  FormFieldReport,
  FilesFormFieldReport,
} from '@indocal/services';

export interface FilesReportProps {
  report: FormFieldReport;
}

export const FilesReport: React.FC<FilesReportProps> = ({ report }) => {
  const content = useMemo(
    () => report.content as FilesFormFieldReport,
    [report]
  );

  const { loading, files, error } = useFiles({
    filters: { id: { in: content.lastAnswers } },
  });

  const options: ChartOptions = useMemo(
    () => ({
      chart: {
        id: FilesReport.name + report.field.id,
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

  const icons = useMemo<Record<string, React.ReactElement>>(
    () => ({
      text: <FileIcon />,
      image: <ImageIcon />,
      video: <VideoIcon />,
      audio: <AudioIcon />,
    }),
    []
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
          ) : files.length > 0 ? (
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
                {files.map((file) => {
                  const url = new URL(
                    file.path,
                    process.env.NEXT_PUBLIC_BACKEND_URL
                  );

                  return (
                    <Grid key={file.id} item>
                      <Button
                        key={file.id}
                        component={Link}
                        size="small"
                        variant="outlined"
                        href={url.toString()}
                        target="_blank"
                        startIcon={
                          icons[file.mime.split('/')[0]] ?? <FileIcon />
                        }
                        sx={{ width: 'fit-content' }}
                      >
                        {file.name}
                      </Button>
                    </Grid>
                  );
                })}
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

export default FilesReport;
