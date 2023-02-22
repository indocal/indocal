import { Entity, UUID } from '../../../../../common';

type Folder = {
  id: UUID;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export interface File extends Entity {
  path: string;
  mime: string;
  extension: string;
  size: number;
  dimensions: [number, number];
  name: string;
  caption: string | null;
  alt: string | null;
  folder: Folder | null;
}

export default File;
