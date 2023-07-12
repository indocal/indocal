import { useState, useMemo, useCallback } from 'react';
import {
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  AddCircle as AddIcon,
  Edit as EditIcon,
  ShortText as TextIcon,
  Draw as SignatureIcon,
  TableChart as TableIcon,
} from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';

import { NoData } from '@indocal/ui';
import {
  Service,
  ServiceCertificateTemplatePlaceholderType,
} from '@indocal/services';

import { DesignCertificateTemplateDialogData } from '../../../../context';

import { PlaceholdersConfigProvider, usePlaceholdersConfig } from './context';
import { AddPlaceholderDialog, EditPlaceholderDialog } from './components';

export interface PlaceholdersConfigProps {
  service: Service;
}

const PlaceholdersConfig: React.FC<PlaceholdersConfigProps> = ({ service }) => {
  const {
    formState: { isSubmitting },
  } = useFormContext<DesignCertificateTemplateDialogData>();

  const {
    isAddPlaceholderDialogOpen,
    isEditPlaceholderDialogOpen,
    toggleAddPlaceholderDialog,
    toggleEditPlaceholderDialog,
  } = usePlaceholdersConfig();

  const [placeholder, setPlaceholder] = useState<
    NonNullable<Service['template']>['placeholders'][number] | null
  >(null);

  const icons = useMemo<
    Record<ServiceCertificateTemplatePlaceholderType, React.ReactElement>
  >(
    () => ({
      TEXT: <TextIcon />,
      TABLE: <TableIcon />,
      SIGNATURE: <SignatureIcon />,
    }),
    []
  );

  const handleEdit = useCallback(
    (placeholder: NonNullable<Service['template']>['placeholders'][number]) => {
      setPlaceholder(placeholder);
      toggleEditPlaceholderDialog();
    },
    [toggleEditPlaceholderDialog]
  );

  return (
    <>
      {isAddPlaceholderDialogOpen && <AddPlaceholderDialog />}

      {isEditPlaceholderDialogOpen && placeholder && (
        <EditPlaceholderDialog placeholder={placeholder} />
      )}

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Placeholders</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Stack spacing={1.5} divider={<Divider flexItem />}>
            <Button
              variant="contained"
              size="small"
              disabled={isSubmitting}
              endIcon={<AddIcon />}
              onClick={toggleAddPlaceholderDialog}
            >
              Nuevo placeholder
            </Button>

            {service.template && service.template.placeholders.length ? (
              <List>
                {service.template.placeholders.map((placeholder) => (
                  <ListItem key={placeholder.name} divider>
                    <ListItemIcon>{icons[placeholder.type]}</ListItemIcon>

                    <ListItemText
                      primary={placeholder.title}
                      secondary={placeholder.name}
                    />

                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        disabled={isSubmitting}
                        onClick={() => handleEdit(placeholder)}
                      >
                        <EditIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <NoData message="Placeholders aún sin definir" />
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

const PlaceholdersConfigWrapper: React.FC<PlaceholdersConfigProps> = ({
  service,
}) => (
  <PlaceholdersConfigProvider service={service}>
    <PlaceholdersConfig service={service} />
  </PlaceholdersConfigProvider>
);

export { PlaceholdersConfigWrapper as PlaceholdersConfig };

export default PlaceholdersConfigWrapper;
