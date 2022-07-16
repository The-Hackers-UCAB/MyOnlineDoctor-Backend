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
import { DoctorSurnames } from './doctor/domain/value-objects/doctor-surnames';
import { DoctorLocation } from './doctor/domain/value-objects/doctor-location';
import { DoctorRating } from './doctor/domain/value-objects/doctor-rating';
import { DoctorGender } from './doctor/domain/value-objects/doctor-gender.enum';
import { DoctorStatus } from './doctor/domain/value-objects/doctor-status.enum';
import { DoctorSpecialty } from './doctor/domain/value-objects/doctor-specialty.enum';
import { DoctorRatingDomainService } from './doctor/domain/domain-services/doctor-rating-domain-service';

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
    DoctorNames.create("John"),
    DoctorSurnames.create("Smith"),
    DoctorLocation.create(-5, -152),
    DoctorRating.create(
      10, 150,
      (new DoctorRatingDomainService()).execute({ count: 10, total: 150 })
    ),
    DoctorGender.MALE,
    DoctorStatus.ACTIVE,
    [DoctorSpecialty.CARDIOLOGY, DoctorSpecialty.NEPHROLOGY]
  );

  console.log(doctor.pullEvents());
}
bootstrap();
