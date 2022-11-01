import NextLink from 'next/link';
import {
  Stack,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Link as MuiLink,
  LinearProgress,
} from '@mui/material';
import {
  Launch as ViewDetailsIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { useForm, getShortUUID, UUID, Form } from '@indocal/services';

import { Pages } from '@/config';

import { FormCardProvider, useFormCard } from './context';
import { EditFormDialog } from './components';

export interface FormCardProps {
  form: UUID | Form;
}

const FormCard: React.FC<FormCardProps> = ({ form: entity }) => {
  const { loading, validating, form, error } = useForm(
    typeof entity === 'string' ? entity : entity.id
  );

  const { isEditFormDialogOpen, toggleEditFormDialog } = useFormCard();

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

          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <CardHeader
            subheader="Detalles del formulario"
            action={
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <NextLink passHref href={`${Pages.FORMS}/${form.id}`}>
                  <IconButton
                    LinkComponent={MuiLink}
                    size="small"
                    sx={{ display: 'flex' }}
                  >
                    <ViewDetailsIcon />
                  </IconButton>
                </NextLink>

                <IconButton size="small" onClick={toggleEditFormDialog}>
                  <EditIcon />
                </IconButton>
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
                  />
                </ListItem>
              )}

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
