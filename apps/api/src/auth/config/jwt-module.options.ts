import { JwtModuleOptions } from '@nestjs/jwt';

export const JWT_MODULE_OPTIONS: JwtModuleOptions = {
  secret: process.env.JWT_SECRET,
};

export default JWT_MODULE_OPTIONS;
