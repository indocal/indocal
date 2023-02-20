import { Module } from '@nestjs/common';

import { FoldersModule, FilesModule } from './submodules';

@Module({
  imports: [FoldersModule, FilesModule],
})
export class UploadsModule {}

export default UploadsModule;
