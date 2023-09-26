import NextLink from 'next/link';
import {
  Stack,
  Divider,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
} from '@mui/material';
import { CardMembership as CertificateIcon } from '@mui/icons-material';

import { getShortUUID, ServiceCertificate } from '@indocal/services';

import { Pages } from '@/config';

export interface ServiceCertificateCardProps {
  certificate: ServiceCertificate;
}

export const ServiceCertificateCard: React.FC<ServiceCertificateCardProps> = ({
  certificate,
}) => (
  <Card
    sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
    }}
  >
    <CardContent sx={{ height: '100%', overflow: 'auto' }}>
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={4}
        divider={<Divider flexItem />}
        sx={{ width: '100%', height: '100%' }}
      >
        <Stack
          spacing={1}
          divider={<Divider flexItem />}
          sx={{ width: '100%', paddingX: (theme) => theme.spacing(5) }}
        >
          <Stack>
            <Typography variant="h6" align="center" fontWeight="bolder">
              Solicitud
            </Typography>

            <Typography variant="caption" align="center" color="text.secondary">
              {getShortUUID(certificate.request.id)}
            </Typography>
          </Stack>

          <Stack>
            <Typography variant="h6" align="center" fontWeight="bolder">
              Servicio
            </Typography>

            <Typography variant="caption" align="center" color="text.secondary">
              {certificate.service.title}
            </Typography>
          </Stack>
        </Stack>

        <Stack justifyContent="center" alignItems="center">
          <Avatar alt={certificate.user.name} sx={{ width: 55, height: 55 }} />

          <Typography variant="h6" align="center" fontWeight="bolder">
            {certificate.user.name}
          </Typography>
        </Stack>
      </Stack>
    </CardContent>

    <CardActions
      sx={{
        marginTop: 'auto',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Button
        LinkComponent={NextLink}
        href={`${Pages.SERVICES_CERTIFICATES}/${certificate.id}`}
        target="_blank"
        fullWidth
        size="small"
        variant="contained"
        endIcon={<CertificateIcon />}
      >
        Descargar certificado
      </Button>
    </CardActions>
  </Card>
);

export default ServiceCertificateCard;
