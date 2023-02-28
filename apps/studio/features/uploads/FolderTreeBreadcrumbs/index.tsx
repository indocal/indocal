import NextLink from 'next/link';
import { Breadcrumbs, Link as MuiLink } from '@mui/material';

import { useFolder, UUID, Folder } from '@indocal/services';

import { Pages } from '@/config';

export interface FolderTreeBreadcrumbsProps {
  folder: UUID | Folder;
}

export const FolderTreeBreadcrumbs: React.FC<FolderTreeBreadcrumbsProps> = ({
  folder: entity,
}) => {
  const { folder } = useFolder(typeof entity === 'string' ? entity : entity.id);

  return (
    <Breadcrumbs>
      <MuiLink
        component={NextLink}
        href={Pages.UPLOADS}
        color="inherit"
        underline="none"
      >
        Librería de archivos
      </MuiLink>

      {folder && folder.folder && (
        <MuiLink
          component={NextLink}
          href={`${Pages.UPLOADS}/${folder.folder.id}`}
          color="inherit"
          underline="none"
        >
          {folder.folder.name}
        </MuiLink>
      )}

      {folder && (
        <MuiLink
          component={NextLink}
          href={`${Pages.UPLOADS}/${folder.id}`}
          color="inherit"
          underline="none"
        >
          {folder.name}
        </MuiLink>
      )}
    </Breadcrumbs>
  );
};

export default FolderTreeBreadcrumbs;
