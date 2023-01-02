import {
  AuthService,
  FormsService,
  EventsService,
  WarehouseService,
} from './modules';
import { Config, ConfigOptions } from './config';

export class INDOCAL {
  config: Config;
  auth: AuthService;
  forms: FormsService;
  events: EventsService;
  warehouse: WarehouseService;

  constructor(options: ConfigOptions) {
    this.config = new Config(options);
    this.auth = new AuthService(this.config);
    this.forms = new FormsService(this.config);
    this.events = new EventsService(this.config);
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
