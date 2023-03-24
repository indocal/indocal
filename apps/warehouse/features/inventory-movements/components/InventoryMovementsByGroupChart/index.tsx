import { useMemo } from 'react';
import { Paper, Box, Stack, Divider, LinearProgress } from '@mui/material';
import { useForm, Control } from 'react-hook-form';
import { startOfMonth, endOfMonth } from 'date-fns';

import {
  Loader,
  NoData,
  ErrorInfo,
  ControlledDatePicker,
  Chart,
  ChartSeries,
  ChartOptions,
} from '@indocal/ui';
import { ControlledUsersGroupsAutocomplete } from '@indocal/forms-generator';
import { useInventoryMovements, UserGroup } from '@indocal/services';

type FormData = {
  group: UserGroup | null;
  month: Date | null;
};

export const InventoryMovementsByGroupChart: React.FC = () => {
  const { control, watch } = useForm<FormData>({
    defaultValues: {
      group: null,
      month: new Date(),
    },
  });

  const group: UserGroup | null = watch().group || null;
  const month: Date = watch().month || new Date();

  const { loading, validating, movements, error } = useInventoryMovements({
    filters: {
      type: 'OUTPUT',
      createdAt: {
        gte: startOfMonth(month),
        lte: endOfMonth(month),
      },
      ...(group && {
        destination: { id: group.id },
      }),
    },
  });

  const data = useMemo(() => {
    type Data = {
      supply: string;
      count: number;
    };

    const data = new Map<string, Data>();

    movements.forEach((movement) => {
      movement.items.forEach((item) => {
        const record = data.get(item.supply.id);

        if (record) {
          data.set(item.supply.id, {
            supply: item.supply.name,
            count: record.count + item.quantity,
          });
        } else {
          data.set(item.supply.id, {
            supply: item.supply.name,
            count: item.quantity,
          });
        }
      });
    });

    return Array.from(data.values());
  }, [movements]);

  const options: ChartOptions = useMemo(
    () => ({
      chart: {
        id: InventoryMovementsByGroupChart.name,
        toolbar: { show: false },
      },
      title: {
        text: 'Historial de movimientos',
        style: {
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          fontWeight: 500,
        },
      },
      xaxis: { categories: data.map(({ supply }) => supply) },
    }),
    [data]
  );

  const series: ChartSeries = useMemo(
    () => [
      {
        name: 'Entregado',
        data: data.map(({ count }) => count),
      },
    ],
    [data]
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
        <Loader invisible message="Cargando movimientos..." />
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
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Box sx={{ width: 200 }}>
                <ControlledUsersGroupsAutocomplete
                  name="group"
                  label="Área"
                  control={control as unknown as Control}
                  textFieldProps={{ size: 'small' }}
                />
              </Box>

              <Box>
                <ControlledDatePicker
                  name="month"
                  label="Mes / Año"
                  control={control as unknown as Control}
                  textFieldProps={{ size: 'small' }}
                  datePickerProps={{
                    views: ['month', 'year'],
                    openTo: 'month',
                  }}
                />
              </Box>
            </Stack>

            {movements.length > 0 ? (
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
              <NoData message="No se han encontrado movimientos" />
            )}
          </Stack>
        </>
      )}
    </Paper>
  );
};

export default InventoryMovementsByGroupChart;
