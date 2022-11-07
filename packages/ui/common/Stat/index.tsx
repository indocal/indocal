import {
  Stack,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  InfoOutlined as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingFlat as TrendingFlatIcon,
  TrendingDown as TrendingDownIcon,
  Numbers as NumberIcon,
  Percent as PercentIcon,
} from '@mui/icons-material';

export type StatTrending = {
  trend: 'UP' | 'FLAT' | 'DOWN';
  description: string;
};

export interface StatProps {
  title: string;
  value: string | number;
  description?: string;
  trending?: StatTrending;
  loading?: boolean;
  validating?: boolean;
}

export const Stat: React.FC<StatProps> = ({
  title,
  value,
  description,
  trending,
  loading,
  validating,
}) => (
  <Card
    sx={{
      position: 'relative',
      display: 'grid',
      width: 275,
      aspectRatio: '16 / 9',
      overflow: 'hidden',
    }}
  >
    {loading ? (
      <CircularProgress sx={{ margin: 'auto' }} />
    ) : (
      <>
        {validating && (
          <LinearProgress
            sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
          />
        )}

        <CardHeader
          title={title}
          subheader={value}
          subheaderTypographyProps={{
            sx: {
              fontSize: '1.30em',
              fontWeight: 'bolder',
            },
          }}
          action={
            description && (
              <Tooltip title={description}>
                <InfoIcon fontSize="small" color="info" />
              </Tooltip>
            )
          }
          sx={{ marginBottom: 'auto' }}
        />

        {trending && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            sx={{ borderTop: (theme) => `1px dashed ${theme.palette.divider}` }}
          >
            <Tooltip title={trending.description}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: (theme) => theme.spacing(1),
                  padding: (theme) => theme.spacing(1.5),
                }}
              >
                {trending.trend === 'UP' && (
                  <TrendingUpIcon fontSize="small" color="success" />
                )}

                {trending.trend === 'FLAT' && (
                  <TrendingFlatIcon fontSize="small" color="disabled" />
                )}

                {trending.trend === 'DOWN' && (
                  <TrendingDownIcon fontSize="small" color="error" />
                )}
              </CardContent>
            </Tooltip>

            <CardActions>
              <ToggleButtonGroup exclusive size="small">
                <ToggleButton value="#">
                  <NumberIcon sx={{ fontSize: 15 }} />
                </ToggleButton>

                <ToggleButton value="%">
                  <PercentIcon sx={{ fontSize: 15 }} />
                </ToggleButton>
              </ToggleButtonGroup>
            </CardActions>
          </Stack>
        )}
      </>
    )}
  </Card>
);

export default Stat;
