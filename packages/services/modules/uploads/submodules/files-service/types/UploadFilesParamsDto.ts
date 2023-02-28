import { UUID } from '../../../../../common';

export type UploadFilesParamsDto = Partial<{
  folder: UUID;
}>;

export default UploadFilesParamsDto;
