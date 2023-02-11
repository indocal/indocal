import { Exclude } from 'class-transformer';
import { Folder } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class FolderEntity implements Entity, Folder {
  constructor(folder: Folder) {
    Object.assign(this, folder);
  }

  id: UUID;
  name: string;

  @Exclude()
  folderId: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export default FolderEntity;
