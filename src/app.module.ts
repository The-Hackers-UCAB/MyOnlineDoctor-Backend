import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './security/auth/auth.module';
import { DoctorController } from './doctor/infrastructure/controllers/doctor.controller';
import { PatientController } from './patient/infrastructure/controllers/patient.controller';
import { AppointmentController } from './appointment/infrastructure/controllers/appointment.controller';
import { MedicalRecordController } from './medical-record/infrastructure/controllers/medical-record.controller';
import { HttpModule } from '@nestjs/axios';
import config from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(config),
    AuthModule,
    HttpModule
  ],
  controllers: [DoctorController, PatientController, AppointmentController, MedicalRecordController],
  providers: [],
})
export class AppModule { }
