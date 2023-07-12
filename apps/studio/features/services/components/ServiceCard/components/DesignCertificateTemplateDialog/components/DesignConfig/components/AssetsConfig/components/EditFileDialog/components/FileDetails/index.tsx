import { List, ListItem, ListItemText } from '@mui/material';

import { Service } from '@indocal/services';

export interface FileDetailsProps {
  asset: NonNullable<Service['template']>['assets'][number];
}

export const FileDetails: React.FC<FileDetailsProps> = ({ asset }) => {
  const [width, height] = asset.dimensions;

  return (
    <List
      disablePadding
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: (theme) => theme.spacing(1),
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <ListItem dense sx={{ width: 'fit-content' }}>
        <ListItemText primary="Extensión" secondary={asset.extension} />
      </ListItem>

      <ListItem dense sx={{ width: 'fit-content' }}>
        <ListItemText
          primary="Tamaño"
          secondary={`${(asset.size / 1024 / 1024).toFixed(2)} MB`}
        />
      </ListItem>

      <ListItem dense sx={{ width: 'fit-content' }}>
        <ListItemText
          primary="Dimensiones"
          secondary={width && height ? `${width}x${height} ` : '--'}
        />
      </ListItem>

      <ListItem dense sx={{ width: 'fit-content' }}>
        <ListItemText
          primary="Fecha de creación"
          secondary={new Date(asset.createdAt).toLocaleString()}
        />
      </ListItem>
    </List>
  );
};

export default FileDetails;
