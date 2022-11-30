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
  LinearProgress,
} from '@mui/material';
import { Launch as ViewDetailsIcon } from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { useFormEntry, getShortUUID, UUID, FormEntry } from '@indocal/services';

import { Pages } from '@/config';

export interface FormEntryCardProps {
  entry: UUID | FormEntry;
}

export const FormEntryCard: React.FC<FormEntryCardProps> = ({
  entry: entity,
}) => {
  const { loading, validating, entry, error } = useFormEntry(
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
        <Loader invisible message="Cargando entrada..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : entry ? (
        <>
          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <CardHeader
            subheader="Detalles de la entrada"
            action={
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <IconButton
                  LinkComponent={NextLink}
                  href={`${Pages.FORMS_ENTRIES}/${entry.id}`}
                  size="small"
                  sx={{ display: 'flex' }}
                >
                  <ViewDetailsIcon />
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
                <ListItemText primary="ID" secondary={getShortUUID(entry.id)} />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Campos respondidos"
                  secondary={entry.answers.length}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Formulario"
                  secondary={entry.form.title}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Respondido por"
                  secondary={entry.answeredBy?.username || 'Anónimo'}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Respondido el"
                  secondary={new Date(entry.createdAt).toLocaleString()}
                />
              </ListItem>
            </List>
          </CardContent>
        </>
      ) : (
        <NoData message="No se han encontrado datos de la entrada" />
      )}
    </Card>
  );
};

export default FormEntryCard;
