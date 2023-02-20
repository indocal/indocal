import { UUID } from '../../../../../common';

export type CreateFolderDto = {
  name: string;
  folder?: UUID;
};

export default CreateFolderDto;
