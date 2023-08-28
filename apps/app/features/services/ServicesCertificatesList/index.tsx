import NextLink from 'next/link';
import {
  Paper,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { Preview as ViewIcon } from '@mui/icons-material';

import { NoData } from '@indocal/ui';
import { getShortUUID, Entity } from '@indocal/services';

import { Pages } from '@/config';

type Certificate = Entity;

export interface ServicesCertificatesListProps {
  certificates: Certificate[];
}

export const ServicesCertificatesList: React.FC<
  ServicesCertificatesListProps
> = ({ certificates }) => (
  <Paper sx={{ width: '100%', height: '100%' }}>
    <List
      disablePadding
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <ListSubheader>Certificados expedidos</ListSubheader>

      {certificates.length > 0 ? (
        certificates.map((certificate) => (
          <ListItem key={certificate.id} divider>
            <ListItemText
              primary={getShortUUID(certificate.id)}
              secondary={`Expedido el ${new Date().toLocaleDateString(
                'es-do'
              )}`}
            />

            <ListItemSecondaryAction>
              <IconButton
                LinkComponent={NextLink}
                href={`${Pages.SERVICES_CERTIFICATES}/${certificate.id}`}
                target="_blank"
                size="small"
              >
                <ViewIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))
      ) : (
        <NoData message="Aún no se han expedido certificados" />
      )}
    </List>
  </Paper>
);

export default ServicesCertificatesList;
