import {
  LogsService,
  AuthService,
  FormsService,
  UploadsService,
  WarehouseService,
} from './modules';
import { Config, ConfigOptions } from './config';

export class INDOCAL {
  config: Config;
  logs: LogsService;
  auth: AuthService;
  forms: FormsService;
  uploads: UploadsService;
  warehouse: WarehouseService;

  constructor(options: ConfigOptions) {
    this.config = new Config(options);
    this.logs = new LogsService(this.config);
    this.auth = new AuthService(this.config);
    this.forms = new FormsService(this.config);
    this.uploads = new UploadsService(this.config);
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
