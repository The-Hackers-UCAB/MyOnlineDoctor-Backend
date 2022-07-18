import 'dotenv/config';
import { SessionsRepository } from '../src/security/auth/sessions/repositories/session.repository';
import { TypeormStore } from 'connect-typeorm/out';
import { UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ExceptionInterceptor } from './core/infrastructure/interceptors/exception.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    })
  );

  app.use(
    session({
      name: 'session',
      store: new TypeormStore({ cleanupLimit: 2 }).connect(getCustomRepository(SessionsRepository)),
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        httpOnly: false,
        maxAge: Number.parseInt(process.env.SESSION_MAX_AGE),
        sameSite: (process.env.SESSION_SAME_SITE == 'none' ? 'none' : (process.env.SESSION_SAME_SITE == 'lax' ? 'lax' : 'strict')),
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalInterceptors(new ExceptionInterceptor());

  await app.listen(Number.parseInt(process.env.PORT) || 3000);
}
bootstrap();
