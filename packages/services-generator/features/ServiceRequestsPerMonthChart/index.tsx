import { useMemo } from 'react';
import { Box, Paper, Stack, Divider, LinearProgress } from '@mui/material';
import { useForm, Control } from 'react-hook-form';

import {
  Loader,
  NoData,
  ErrorInfo,
  Chart,
  ChartSeries,
  ChartOptions,
  ControlledDatePicker,
} from '@indocal/ui';
import { useServiceRequestsPerMonth, UUID, Service } from '@indocal/services';

type FormData = {
  year: Date;
};

export interface ServiceRequestsPerMonthChartProps {
  service: UUID | Service;
}

export const ServiceRequestsPerMonthChart: React.FC<
  ServiceRequestsPerMonthChartProps
> = ({ service }) => {
  const { control, watch } = useForm<FormData>({
    defaultValues: {
      year: new Date(),
    },
  });

  const year = watch('year') || new Date();

  const { loading, validating, requestsPerMonth, error } =
    useServiceRequestsPerMonth(
      typeof service === 'string' ? service : service.id,
      {
        year,
      }
    );

  const options: ChartOptions = useMemo(
    () => ({
      chart: {
        id: ServiceRequestsPerMonthChart.name,
        toolbar: { show: true },
      },
      title: {
        text: 'Solicitudes por mes',
        style: {
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          fontWeight: 500,
        },
      },
      xaxis: { categories: requestsPerMonth.map((request) => request.month) },
    }),
    [requestsPerMonth]
  );

  const series: ChartSeries = useMemo(
    () => [
      {
        name: 'Cantidad de solicitudes',
        data: requestsPerMonth.map((request) => request.count),
      },
    ],
    [requestsPerMonth]
  );

  return (
    <Paper
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {loading ? (
        <Loader invisible message="Buscando solicitudes..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : (
        <>
          {validating && (
            <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: (theme) => theme.zIndex.modal - 1,
                width: '100%',
                borderTopLeftRadius: (theme) => theme.shape.borderRadius,
                borderTopRightRadius: (theme) => theme.shape.borderRadius,
              }}
            />
          )}

          <Stack
            spacing={1}
            divider={<Divider flexItem />}
            sx={{ height: '100%', padding: (theme) => theme.spacing(2) }}
          >
            <Stack
              direction="row"
              justifyContent="flex-end"
              justifyItems="center"
              spacing={1}
            >
              <ControlledDatePicker
                name="year"
                label="Año"
                control={control as unknown as Control}
                textFieldProps={{ size: 'small' }}
                datePickerProps={{ views: ['year'] }}
              />
            </Stack>

            {requestsPerMonth.length > 0 ? (
              <Box sx={{ flex: 1 }}>
                <Chart
                  type="bar"
                  width="100%"
                  height="100%"
                  series={series}
                  options={options}
                />
              </Box>
            ) : (
              <NoData message="No se han encontrado solicitudes" />
            )}
          </Stack>
        </>
      )}
    </Paper>
  );
};

export default ServiceRequestsPerMonthChart;
