import 'dotenv/config';
import { SessionsRepository } from '../src/security/auth/sessions/repositories/session.repository';
import { TypeormStore } from 'connect-typeorm/out';
import { ValidationPipe } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { Doctor } from './doctor/domain/doctor';
import { DoctorId } from './doctor/domain/value-objects/doctor-id';
import { DoctorNames } from './doctor/domain/value-objects/doctor-names';

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

  await app.listen(Number.parseInt(process.env.PORT) || 3000);

  const doctor = Doctor.create(
    DoctorId.create(1),
    DoctorNames.create("John", "Smiht")
  );

  console.log(doctor.pullEvents());
}
bootstrap();
