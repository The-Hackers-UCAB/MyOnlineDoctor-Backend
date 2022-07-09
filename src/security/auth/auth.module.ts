import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './sessions/session.serializer';
import { PassportModule } from '@nestjs/passport';

/** AuthModule: Módulo de autenticación de NestJs - Express Sessions & Passport. (Sistema Externo). */
@Module({
  imports: [PassportModule.register({ session: true })],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  controllers: [AuthController]
})
export class AuthModule { }
