import { Entity } from '../../../../../common';

type Root = Entity & {
  name: string;
};

export interface Folder extends Entity {
  name: string;
  folder: Root | null;
}

export default Folder;
