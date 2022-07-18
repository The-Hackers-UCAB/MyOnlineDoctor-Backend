import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './security/auth/auth.module';
import { DoctorController } from './doctor/infrastructure/controllers/doctor.controller';
import config from '../ormconfig';
import { PatientController } from './patient/infrastructure/controllers/patient.controller';
import { AppointmentController } from './appointment/infrastructure/controllers/appointment.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(config),
    AuthModule,
  ],
  controllers: [DoctorController, PatientController, AppointmentController],
  providers: [],
})
export class AppModule { }
