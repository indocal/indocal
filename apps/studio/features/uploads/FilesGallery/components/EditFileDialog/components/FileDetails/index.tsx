import { List, ListItem, ListItemText } from '@mui/material';

import { File } from '@indocal/services';

export interface FileDetailsProps {
  file: File;
}

export const FileDetails: React.FC<FileDetailsProps> = ({ file }) => (
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
      <ListItemText primary="Extensión" secondary={file.extension} />
    </ListItem>

    <ListItem dense sx={{ width: 'fit-content' }}>
      <ListItemText
        primary="Tamaño"
        secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
      />
    </ListItem>

    <ListItem dense sx={{ width: 'fit-content' }}>
      <ListItemText
        primary="Dimensiones"
        secondary={
          file.dimensions.length > 0
            ? `${file.dimensions[0]}x${file.dimensions[1]} `
            : '--'
        }
      />
    </ListItem>

    <ListItem dense sx={{ width: 'fit-content' }}>
      <ListItemText
        primary="Fecha de creación"
        secondary={new Date(file.createdAt).toLocaleString()}
      />
    </ListItem>
  </List>
);

export default FileDetails;
