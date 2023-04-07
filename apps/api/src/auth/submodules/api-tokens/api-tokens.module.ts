import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';

import { JWT_MODULE_OPTIONS } from '../../config';
import { AbilityFactory } from '../../strategies/attribute-based-access-control';

import ApiTokensController from './api-tokens.controller';

@Module({
  imports: [JwtModule.register(JWT_MODULE_OPTIONS)],
  controllers: [ApiTokensController],
  providers: [PrismaService, AbilityFactory],
})
export class ApiTokensModule {}

export default ApiTokensModule;
