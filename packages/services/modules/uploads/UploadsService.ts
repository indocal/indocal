import { Config } from '../../config';

import { FoldersService, FilesService } from './submodules';

export class UploadsService {
  folders: FoldersService;
  files: FilesService;

  constructor(private config: Config) {
    this.folders = new FoldersService(config);
    this.files = new FilesService(config);
  }
}

export default UploadsService;
