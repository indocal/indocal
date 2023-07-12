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
  FilePresent as FileIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
} from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';

import { NoData } from '@indocal/ui';
import { Service } from '@indocal/services';

import { DesignCertificateTemplateDialogData } from '../../../../context';

import { AssetsConfigProvider, useAssetsConfig } from './context';
import { AddFileDialog, EditFileDialog } from './components';

export interface AssetsConfigProps {
  service: Service;
}

const AssetsConfig: React.FC<AssetsConfigProps> = ({ service }) => {
  const {
    formState: { isSubmitting },
  } = useFormContext<DesignCertificateTemplateDialogData>();

  const {
    isAddFileDialogOpen,
    isEditFileDialogOpen,
    toggleAddFileDialog,
    toggleEditFileDialog,
  } = useAssetsConfig();

  const icons = useMemo<Record<string, React.ReactElement>>(
    () => ({
      text: <FileIcon />,
      image: <ImageIcon />,
      video: <VideoIcon />,
      audio: <AudioIcon />,
    }),
    []
  );

  const [asset, setFile] = useState<
    NonNullable<Service['template']>['assets'][number] | null
  >(null);

  const handleEdit = useCallback(
    (asset: NonNullable<Service['template']>['assets'][number]) => {
      setFile(asset);
      toggleEditFileDialog();
    },
    [toggleEditFileDialog]
  );

  return (
    <>
      {isAddFileDialogOpen && <AddFileDialog />}
      {isEditFileDialogOpen && asset && <EditFileDialog asset={asset} />}

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Recursos</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Stack spacing={1.5} divider={<Divider flexItem />}>
            <Button
              variant="contained"
              size="small"
              disabled={isSubmitting}
              endIcon={<AddIcon />}
              onClick={toggleAddFileDialog}
            >
              Nuevo recurso
            </Button>

            {service.template && service.template.assets.length ? (
              <List>
                {service.template.assets.map((asset) => {
                  const [mime] = asset.mime.split('/');

                  return (
                    <ListItem key={asset.id} divider>
                      <ListItemIcon>{icons[mime] ?? <FileIcon />}</ListItemIcon>

                      <ListItemText>{asset.name}</ListItemText>

                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          disabled={isSubmitting}
                          onClick={() => handleEdit(asset)}
                        >
                          <EditIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <NoData message="Recursos aún sin cargar" />
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

const AssetsConfigWrapper: React.FC<AssetsConfigProps> = ({ service }) => (
  <AssetsConfigProvider service={service}>
    <AssetsConfig service={service} />
  </AssetsConfigProvider>
);

export { AssetsConfigWrapper as AssetsConfig };

export default AssetsConfigWrapper;
