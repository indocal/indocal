import {
  LogsService,
  AuthService,
  FormsService,
  ServicesService,
  UploadsService,
  CommentsComment,
  WarehouseService,
} from './modules';
import { Config, ConfigOptions } from './config';

export class INDOCAL {
  config: Config;
  logs: LogsService;
  auth: AuthService;
  forms: FormsService;
  services: ServicesService;
  uploads: UploadsService;
  comments: CommentsComment;
  warehouse: WarehouseService;

  constructor(options: ConfigOptions) {
    this.config = new Config(options);
    this.logs = new LogsService(this.config);
    this.auth = new AuthService(this.config);
    this.forms = new FormsService(this.config);
    this.services = new ServicesService(this.config);
    this.uploads = new UploadsService(this.config);
    this.comments = new CommentsComment(this.config);
    this.warehouse = new WarehouseService(this.config);
  }
}

export default INDOCAL;

////////////////
// Re-exports //
////////////////

export * from './common';
export * from './modules';
export * from './config';
