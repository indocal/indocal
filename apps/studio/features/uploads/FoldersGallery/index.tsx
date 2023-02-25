import {
  Grid,
  Stack,
  Divider,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Folder as FolderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import { Folder } from '@indocal/services';

export interface FoldersGalleryProps {
  title: string;
  folders: Folder[];
}

export const FoldersGallery: React.FC<FoldersGalleryProps> = ({
  title,
  folders,
}) => (
  <Grid container alignItems="center" spacing={1}>
    <Grid item xs={12}>
      <Typography variant="h6">{title}</Typography>
    </Grid>

    {folders.map((folder) => (
      <Grid key={folder.id} item xs={12} sm={6} md={4} lg={3}>
        <Card sx={{ display: 'flex', height: 125 }}>
          <Stack
            divider={<Divider flexItem />}
            sx={{ width: '100%', height: '100%' }}
          >
            <CardContent sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  lineClamp: 2,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  wordBreak: 'break-word',
                  fontWeight: 'bolder',
                }}
              >
                {folder.name}
              </Typography>
            </CardContent>

            <CardActions
              sx={{
                display: 'flex',
                placeContent: 'center',
                placeItems: 'center',
              }}
            >
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>

              <IconButton size="small">
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </CardActions>
          </Stack>

          <CardMedia
            sx={{
              display: 'grid',
              placeContent: 'center',
              placeItems: 'center',
              padding: (theme) => theme.spacing(1),
              borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Avatar>
              <FolderIcon />
            </Avatar>
          </CardMedia>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default FoldersGallery;
