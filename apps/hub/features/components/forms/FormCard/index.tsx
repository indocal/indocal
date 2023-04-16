import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import {
  useForm,
  getShortUUID,
  translateFormVisibility,
  UUID,
  Form,
} from '@indocal/services';

export interface FormCardProps {
  form: UUID | Form;
}

export const FormCard: React.FC<FormCardProps> = ({ form: entity }) => {
  const { loading, validating, form, error } = useForm(
    typeof entity === 'string' ? entity : entity.id
  );

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
          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <CardHeader
            subheader="Detalles del formulario"
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
                  primary="Visibilidad"
                  secondary={translateFormVisibility(form.visibility)}
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
        </>
      ) : (
        <NoData message="No se han encontrado datos del formulario" />
      )}
    </Card>
  );
};

export default FormCard;
