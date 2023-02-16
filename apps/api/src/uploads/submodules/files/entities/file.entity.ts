import { Exclude } from 'class-transformer';
import { File } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class FileEntity implements Entity, File {
  constructor(file: File) {
    Object.assign(this, file);
  }

  id: UUID;
  path: string;

  mime: string;
  extension: string;

  size: number;
  dimensions: number[];

  name: string;
  caption: string | null;
  alt: string | null;

  @Exclude()
  folderId: UUID | null;

  createdAt: Date;
  updatedAt: Date;
}

export default FileEntity;
