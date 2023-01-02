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
  useSupplier,
  getShortUUID,
  UUID,
  Supplier,
} from '@indocal/services';

import { Pages } from '@/config';

import { SupplierCardProvider, useSupplierCard } from './context';
import { EditSupplierDialog } from './components';

export interface SupplierCardProps {
  supplier: UUID | Supplier;
}

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier: entity }) => {
  const { loading, validating, supplier, error } = useSupplier(
    typeof entity === 'string' ? entity : entity.id
  );

  const { isEditSupplierDialogOpen, toggleEditSupplierDialog } =
    useSupplierCard();

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
        <Loader invisible message="Cargando datos del suplidor..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : supplier ? (
        <>
          {isEditSupplierDialogOpen && (
            <EditSupplierDialog supplier={supplier} />
          )}

          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <CardHeader
            subheader="Detalles del suplidor"
            action={
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <Can I="read" a="supplier">
                  <IconButton
                    LinkComponent={NextLink}
                    href={`${Pages.SUPPLIERS}/${supplier.id}`}
                    size="small"
                    sx={{ display: 'flex' }}
                  >
                    <ViewDetailsIcon />
                  </IconButton>
                </Can>

                <Can I="update" a="supplier">
                  <IconButton size="small" onClick={toggleEditSupplierDialog}>
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
                  secondary={getShortUUID(supplier.id)}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText primary="Suplidor" secondary={supplier.name} />
              </ListItem>

              {supplier.description && (
                <ListItem disablePadding>
                  <ListItemText
                    primary="Descripción"
                    secondary={supplier.description}
                  />
                </ListItem>
              )}

              <ListItem disablePadding>
                <ListItemText
                  primary="Fecha de creación"
                  secondary={new Date(supplier.createdAt).toLocaleDateString()}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Última modificación"
                  secondary={new Date(supplier.updatedAt).toLocaleDateString()}
                />
              </ListItem>
            </List>
          </CardContent>
        </>
      ) : (
        <NoData message="No se han encontrado datos del suplidor" />
      )}
    </Card>
  );
};

const SupplierCardWrapper: React.FC<SupplierCardProps> = (props) => (
  <SupplierCardProvider>
    <SupplierCard {...props} />
  </SupplierCardProvider>
);

export { SupplierCardWrapper as SupplierCard };

export default SupplierCardWrapper;
