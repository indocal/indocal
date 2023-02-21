import { Entity, UUID } from '../../../../../common';

type Root = {
  id: UUID;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export interface Folder extends Entity {
  name: string;
  folder: Root | null;
}

export default Folder;
