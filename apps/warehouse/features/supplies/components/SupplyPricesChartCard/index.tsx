import { useMemo } from 'react';
import { Paper, Box, LinearProgress } from '@mui/material';

import {
  Loader,
  NoData,
  ErrorInfo,
  Chart,
  ChartSeries,
  ChartOptions,
} from '@indocal/ui';
import { useSupplyPrices, UUID, Supply } from '@indocal/services';

export interface SupplyPricesChartCardProps {
  supply: UUID | Supply;
}

export const SupplyPricesChartCard: React.FC<SupplyPricesChartCardProps> = ({
  supply: entity,
}) => {
  const { loading, validating, supplyPrices, error } = useSupplyPrices(
    typeof entity === 'string' ? entity : entity.id
  );

  const options: ChartOptions = useMemo(
    () => ({
      chart: { id: SupplyPricesChartCard.name, toolbar: { show: false } },
      title: {
        text: 'Historial de precios',
        style: {
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          fontWeight: 500,
        },
      },
      xaxis: {
        categories: supplyPrices?.priceHistory.map(({ timestamp }) =>
          new Date(timestamp).toLocaleDateString()
        ),
      },
    }),
    [supplyPrices]
  );

  const series: ChartSeries = useMemo(
    () => [
      {
        name: 'Precio',
        data: supplyPrices?.priceHistory.map(({ price }) => price) ?? [],
      },
    ],
    [supplyPrices]
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
        <Loader invisible message="Consultando precios..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : supplyPrices && supplyPrices.priceHistory.length > 0 ? (
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

          <Box
            sx={{
              width: '100%',
              height: '100%',
              padding: (theme) => theme.spacing(2),
            }}
          >
            <Chart
              type="line"
              width="100%"
              height="100%"
              series={series}
              options={options}
            />
          </Box>
        </>
      ) : (
        <NoData message="No se han encontrado datos de los precios del recurso" />
      )}
    </Paper>
  );
};

export default SupplyPricesChartCard;
