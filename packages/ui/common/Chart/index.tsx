import dynamic from 'next/dynamic';
import { useMediaQuery } from '@mui/material';
import { Props as ApexChartProps } from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

import { useUserThemePreferences } from '@indocal/theme';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export type ChartProps = ApexChartProps;
export type ChartSeries = ApexOptions['series'];
export type ChartOptions = ApexOptions;

export const Chart: React.FC<ApexChartProps> = ({ options, ...rest }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const { colorMode } = useUserThemePreferences();

  const defaulOptions: ApexOptions = {
    ...options,
    chart: { ...options?.chart, background: 'transparent' },
    theme: {
      ...options?.theme,
      palette: 'palette7',
      mode:
        colorMode === 'system'
          ? prefersDarkMode
            ? 'dark'
            : 'light'
          : colorMode,
    },
  };

  return <ApexChart options={defaulOptions} {...rest} />;
};

export default Chart;
