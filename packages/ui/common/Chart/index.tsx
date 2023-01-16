import dynamic from 'next/dynamic';
import { useMediaQuery } from '@mui/material';
import { Props as ApexChartProps } from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const Chart: React.FC<ApexChartProps> = ({ options, ...rest }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const defaulOptions: ApexOptions = {
    ...options,
    theme: { ...options?.theme, mode: prefersDarkMode ? 'dark' : 'light' },
    chart: { ...options?.chart, background: 'transparent' },
  };

  return <ApexChart options={defaulOptions} {...rest} />;
};

export default Chart;

export type { ApexChartProps as ChartProps };
export type ChartSeries = ApexOptions['series'];
export type { ApexOptions as ChartOptions };
