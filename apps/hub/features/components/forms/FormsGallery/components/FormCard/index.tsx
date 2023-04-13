import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  QueryStats as ReportsIcon,
  Launch as ViewDetailsIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

import { Form } from '@indocal/services';

export interface FormCardProps {
  form: Form;
}

export const FormCard: React.FC<FormCardProps> = ({ form }) => (
  <Card
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minWidth: 250,
      maxWidth: 250,
      height: 150,
    }}
  >
    <CardContent>
      <Tooltip title={form.title}>
        <Typography
          variant="h6"
          sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 1,
            lineClamp: 1,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            wordBreak: 'break-word',
          }}
        >
          {form.title}
        </Typography>
      </Tooltip>

      {form.description && (
        <Tooltip title={form.description}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
              lineClamp: 1,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              wordBreak: 'break-word',
            }}
          >
            {form.description}
          </Typography>
        </Tooltip>
      )}
    </CardContent>

    <CardActions
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <IconButton>
        <ReportsIcon />
      </IconButton>

      <IconButton>
        <ViewDetailsIcon />
      </IconButton>

      <IconButton>
        <EditIcon />
      </IconButton>
    </CardActions>
  </Card>
);

export default FormCard;
