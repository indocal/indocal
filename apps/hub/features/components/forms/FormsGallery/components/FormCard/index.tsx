import NextLink from 'next/link';
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
  HistoryEdu as AddIcon,
} from '@mui/icons-material';

import { Can, Form } from '@indocal/services';

import { Pages } from '@/config';

import { FormCardProvider, useFormCard } from './context';
import { AddEntryDialog } from './components';

export interface FormCardProps {
  form: Form;
}

const FormCard: React.FC<FormCardProps> = ({ form }) => {
  const { isAddEntryDialogOpen, toggleAddEntryDialog } = useFormCard();

  return (
    <>
      {isAddEntryDialogOpen && <AddEntryDialog form={form} />}

      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 225,
          maxWidth: 225,
          height: 250,
        }}
      >
        <CardContent>
          <Tooltip title={form.title}>
            <Typography
              variant="h6"
              sx={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                lineClamp: 2,
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
                  WebkitLineClamp: 3,
                  lineClamp: 3,
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
          <Can do="generate-reports" on="form">
            <Tooltip title="Ver reportes">
              <IconButton
                LinkComponent={NextLink}
                href={`${Pages.FORMS_REPORTS}/${form.id}`}
                size="small"
                sx={{ display: 'flex' }}
              >
                <ReportsIcon />
              </IconButton>
            </Tooltip>
          </Can>

          <Can I="create" a="formEntry">
            <Tooltip title="Agregar entrada">
              <IconButton onClick={toggleAddEntryDialog}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Can>
        </CardActions>
      </Card>
    </>
  );
};

const FormCardWrapper: React.FC<FormCardProps> = (props) => (
  <FormCardProvider>
    <FormCard {...props} />
  </FormCardProvider>
);

export { FormCardWrapper as FormCard };

export default FormCardWrapper;
