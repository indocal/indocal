import NextLink from 'next/link';
import {
  Stack,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  QueryStats as ReportsIcon,
  Launch as ViewDetailsIcon,
  Edit as EditIcon,
  Handyman as SettingsIcon,
} from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import {
  Can,
  useForm,
  getShortUUID,
  translateFormStatus,
  translateFormVisibility,
  UUID,
  Form,
} from '@indocal/services';

import { Pages } from '@/config';

import { FormCardProvider, useFormCard } from './context';
import { EditFormDialog, ManageFormConfigDialog } from './components';

export interface FormCardProps {
  form: UUID | Form;
}

const FormCard: React.FC<FormCardProps> = ({ form: entity }) => {
  const { loading, validating, form, error } = useForm(
    typeof entity === 'string' ? entity : entity.id
  );

  const {
    isEditFormDialogOpen,
    isManageFormConfigDialogOpen,
    toggleEditFormDialog,
    toggleManageFormConfigDialog,
  } = useFormCard();

  return (
    <Card
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      {loading ? (
        <Loader invisible message="Cargando datos del formulario..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : form ? (
        <>
          {isEditFormDialogOpen && <EditFormDialog form={form} />}

          {isManageFormConfigDialogOpen && (
            <ManageFormConfigDialog form={form} />
          )}

          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <CardHeader
            subheader="Detalles del formulario"
            action={
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <Can do="generate-reports" on="form">
                  <IconButton
                    LinkComponent={NextLink}
                    href={`${Pages.FORMS_REPORTS}/${form.id}`}
                    size="small"
                    sx={{ display: 'flex' }}
                  >
                    <ReportsIcon />
                  </IconButton>
                </Can>

                <Can I="read" a="form">
                  <IconButton
                    LinkComponent={NextLink}
                    href={`${Pages.FORMS}/${form.id}`}
                    size="small"
                    sx={{ display: 'flex' }}
                  >
                    <ViewDetailsIcon />
                  </IconButton>
                </Can>

                <Can I="update" a="form">
                  <IconButton size="small" onClick={toggleEditFormDialog}>
                    <EditIcon />
                  </IconButton>
                </Can>
              </Stack>
            }
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />

          <CardContent
            sx={{
              position: 'relative',
              height: '100%',
              overflow: 'auto',
            }}
          >
            <List disablePadding>
              <ListItem disablePadding>
                <ListItemText primary="ID" secondary={getShortUUID(form.id)} />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText primary="Formulario" secondary={form.title} />
              </ListItem>

              {form.description && (
                <ListItem disablePadding>
                  <ListItemText
                    primary="Descripción"
                    secondary={form.description}
                    secondaryTypographyProps={{
                      component: 'pre',
                      variant: 'caption',
                      color: 'text.secondary',
                      sx: {
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      },
                    }}
                  />
                </ListItem>
              )}

              <ListItem disablePadding>
                <ListItemText
                  primary="Estado"
                  secondary={translateFormStatus(form.status)}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Visibilidad"
                  secondary={translateFormVisibility(form.visibility)}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Fecha de creación"
                  secondary={new Date(form.createdAt).toLocaleDateString()}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Última modificación"
                  secondary={new Date(form.updatedAt).toLocaleDateString()}
                />
              </ListItem>
            </List>
          </CardContent>

          <Can I="update" a="form">
            <CardActions>
              <Button
                fullWidth
                size="small"
                variant="contained"
                endIcon={<SettingsIcon />}
                onClick={toggleManageFormConfigDialog}
              >
                Configuración
              </Button>
            </CardActions>
          </Can>
        </>
      ) : (
        <NoData message="No se han encontrado datos del formulario" />
      )}
    </Card>
  );
};

const FormCardWrapper: React.FC<FormCardProps> = (props) => (
  <FormCardProvider>
    <FormCard {...props} />
  </FormCardProvider>
);

export { FormCardWrapper as FormCard };

export default FormCardWrapper;
