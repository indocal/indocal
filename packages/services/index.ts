import {
  AuthService,
  FormsService,
  WarehouseService,
  UploadsService,
} from './modules';
import { Config, ConfigOptions } from './config';

export class INDOCAL {
  config: Config;
  auth: AuthService;
  forms: FormsService;
  warehouse: WarehouseService;
  uploads: UploadsService;

  constructor(options: ConfigOptions) {
    this.config = new Config(options);
    this.auth = new AuthService(this.config);
    this.forms = new FormsService(this.config);
    this.warehouse = new WarehouseService(this.config);
    this.uploads = new UploadsService(this.config);
  }
}

export default INDOCAL;

////////////////
// Re-exports //
////////////////

export * from './common';
export * from './modules';
export * from './config';
