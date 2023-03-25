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
import {
  Launch as ViewDetailsIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import {
  Can,
  useSupply,
  getShortUUID,
  translateSupplyUnit,
  UUID,
  Supply,
} from '@indocal/services';

import { Pages } from '@/config';

import { SupplyCardProvider, useSupplyCard } from './context';
import { EditSupplyDialog } from './components';

export interface SupplyCardProps {
  supply: UUID | Supply;
}

const SupplyCard: React.FC<SupplyCardProps> = ({ supply: entity }) => {
  const { loading, validating, supply, error } = useSupply(
    typeof entity === 'string' ? entity : entity.id
  );

  const { isEditSupplyDialogOpen, toggleEditSupplyDialog } = useSupplyCard();

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
        <Loader invisible message="Cargando datos del recurso..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : supply ? (
        <>
          {isEditSupplyDialogOpen && <EditSupplyDialog supply={supply} />}

          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <CardHeader
            subheader="Detalles del recurso"
            action={
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <Can I="read" a="supply">
                  <IconButton
                    LinkComponent={NextLink}
                    href={`${Pages.SUPPLIES}/${supply.id}`}
                    size="small"
                    sx={{ display: 'flex' }}
                  >
                    <ViewDetailsIcon />
                  </IconButton>
                </Can>

                <Can I="update" a="supply">
                  <IconButton size="small" onClick={toggleEditSupplyDialog}>
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
                <ListItemText
                  primary="ID"
                  secondary={getShortUUID(supply.id)}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText primary="Código" secondary={supply.code} />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText primary="Recurso" secondary={supply.name} />
              </ListItem>

              {supply.description && (
                <ListItem disablePadding>
                  <ListItemText
                    primary="Descripción"
                    secondary={supply.description}
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
                  primary="Unidad de medida"
                  secondary={translateSupplyUnit(supply.unit)}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText primary="Cantidad" secondary={supply.quantity} />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Fecha de creación"
                  secondary={new Date(supply.createdAt).toLocaleDateString()}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Última modificación"
                  secondary={new Date(supply.updatedAt).toLocaleDateString()}
                />
              </ListItem>
            </List>
          </CardContent>
        </>
      ) : (
        <NoData message="No se han encontrado datos del recurso" />
      )}
    </Card>
  );
};

const SupplyCardWrapper: React.FC<SupplyCardProps> = (props) => (
  <SupplyCardProvider>
    <SupplyCard {...props} />
  </SupplyCardProvider>
);

export { SupplyCardWrapper as SupplyCard };

export default SupplyCardWrapper;
