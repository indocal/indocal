import { useMemo, createElement } from 'react';
import { Stack, Typography, Badge } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { NoData } from '@indocal/ui';
import {
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplateSectionPlaceholderConfig,
} from '@indocal/services';

import { TextItem, SignatureItem } from './components';

export interface SectionPlaceholderFieldProps {
  placeholder: ServiceCertificateTemplatePlaceholder;
}

export const SectionPlaceholderField: React.FC<
  SectionPlaceholderFieldProps
> = ({ placeholder }) => {
  const {
    formState: { errors },
  } = useFormContext();

  const config =
    useMemo<ServiceCertificateTemplateSectionPlaceholderConfig | null>(
      () =>
        placeholder.config as ServiceCertificateTemplateSectionPlaceholderConfig,
      [placeholder.config]
    );

  const items = useMemo(
    () => ({
      TEXT: TextItem,
      SIGNATURE: SignatureItem,
    }),
    []
  );

  return (
    <Stack
      component="fieldset"
      spacing={2}
      sx={{
        margin: 0,
        borderRadius: (theme) => theme.spacing(0.5),
        borderColor: (theme) =>
          config &&
          config.items.some((item) => {
            return `${placeholder.name}__${item.name}` in errors;
          })
            ? theme.palette.error.main
            : theme.palette.divider,
      }}
    >
      <Badge
        component="legend"
        badgeContent="*"
        slotProps={{ badge: { style: { top: 7.5, right: 5 } } }}
        sx={{
          ...(config &&
            config.items.some((item) => {
              return `${placeholder.name}__${item.name}` in errors;
            }) && {
              color: (theme) => theme.palette.error.main,
            }),
        }}
      >
        <Typography
          fontWeight="bolder"
          sx={{ marginX: (theme) => theme.spacing(1) }}
        >
          {placeholder.title}
        </Typography>
      </Badge>

      <Stack
        spacing={2}
        sx={{ marginTop: (theme) => `${theme.spacing(0.75)} !important` }}
      >
        {config && config.items && config.items.length > 0 ? (
          config.items.map((item) =>
            createElement(items[item.type], {
              key: item.name,
              placeholder,
              item,
            })
          )
        ) : (
          <NoData message="Esta sección no contiene campos definidos" />
        )}
      </Stack>
    </Stack>
  );
};

export default SectionPlaceholderField;
