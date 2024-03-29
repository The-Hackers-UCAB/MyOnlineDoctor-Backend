import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { OrmPatientRepository } from '../repositories/orm-patient.repository';
import { EntityManager, getManager } from 'typeorm';
import { ErrorApplicationServiceDecorator } from '../../../core/application/application-service/decoratos/error-decorator/error-application.service.decorator';
import { LoggingApplicationServiceDecorator } from '../../../core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator';
import { Result } from '../../../core/application/result-handler/result';
import { NestLogger } from '../../../core/infrastructure/logger/nest-logger';
import { EventBus } from '../../../core/infrastructure/event-handler/event-bus';
import { PatientCreated } from '../../../patient/domain/events/patient-created.event';
import { UUIDGenerator } from '../../../core/infrastructure/uuid/uuid-generator';
import { RegisterPatientApplicationServiceDto, RegisterPatientApplicationService } from '../../../patient/application/services/register-patient.application.service';
import { Appointment } from '../../../appointment/domain/appointment';
import { SearchPatientAppointmentsApplicationService, SearchPatientAppointmentsApplicationServiceDto } from '../../../patient/application/services/search-patient-appointment.application.service';
import { OrmAppointmentRepository } from '../../../appointment/infrastructure/repositories/orm-appointment.repository';
import { ResultMapper } from '../../../core/application/result-handler/result.mapper';
import { OrmAppointmentMulMapper } from '../../../appointment/infrastructure/mappers/orm-appointment-mul.mapper';
import { OrmAppointment } from '../../../appointment/infrastructure/entities/orm.appointment.entity';
import { SessionGuard } from '../../../core/infrastructure/security/auth/sessions/session.guard';
import { GetPatientId } from '../../../core/infrastructure/security/users/decorators/get-patient-id.decorator';
import { CreateUserDto } from '../../../core/infrastructure/security/users/dtos/create-user.dto';
import { UsersRepository } from '../../../core/infrastructure/security/users/repositories/users.repository';
import { Role } from '../../../core/infrastructure/security/users/roles/role.entity.enum';
import { Roles } from '../../../core/infrastructure/security/users/roles/roles.decorator';
import { RolesGuard } from '../../../core/infrastructure/security/users/roles/roles.guard';
import { OrmPatient } from '../entities/orm-patient.entity';
import { GetPatientProfilesApplicationService, GetPatientProfilesApplicationServiceDto } from '../../../../src/patient/application/services/get-patient-profile.application.service';
import { OrmPatientMapper } from '../mappers/orm-patient-mapper';
import { Patient } from '../../../../src/patient/domain/patient';
import { OrmMedicalRecord } from '../../../../src/medical-record/infrastructure/entities/orm.medical-record.entity';
import { SearchPatientMedicalRecordsApplicationService, SearchPatientMedicalRecordsApplicationServiceDto } from '../../../../src/patient/application/services/search-patient-medical-records.application.service';
import { OrmMedicalRecordMulMapper } from '../../../../src/medical-record/infrastructure/mappers/orm-medical-record-mul.mapper';
import { OrmMedicalRecordRepository } from '../../../../src/medical-record/infrastructure/repositories/orm-medical-record.repository';
import { MedicalRecord } from '../../../../src/medical-record/domain/medical-record';

@Controller('patient')
export class PatientController {

    private readonly ormPatientRepository: OrmPatientRepository;
    private readonly ormMedicalRecordRepository: OrmMedicalRecordRepository;
    private readonly ormMedicalRecordMulMapper: OrmMedicalRecordMulMapper = new OrmMedicalRecordMulMapper();
    private readonly ormAppointmentRepository: OrmAppointmentRepository;
    private readonly ormAppointmentMulMapper: OrmAppointmentMulMapper = new OrmAppointmentMulMapper();
    private readonly ormPatientMapper: OrmPatientMapper = new OrmPatientMapper();
    private readonly uuidGenerator: UUIDGenerator = new UUIDGenerator();

    constructor(private readonly manager: EntityManager) {
        if (!manager) { throw new Error("Entity manager can't be null"); }
        this.ormPatientRepository = this.manager.getCustomRepository(OrmPatientRepository);
        this.ormAppointmentRepository = this.manager.getCustomRepository(OrmAppointmentRepository);
        this.ormMedicalRecordRepository = this.manager.getCustomRepository(OrmMedicalRecordRepository);
    }

    @Post('')
    async registerPatient(@Body() options: { dto: RegisterPatientApplicationServiceDto, createUserDto: CreateUserDto }): Promise<Result<string>> {
        const userRepository = getManager().getCustomRepository(UsersRepository);

        if (await userRepository.findOne({ where: { email: options.createUserDto.email } })) { return Result.fail(new Error("Este usuario ya se encuentra regsitrado.")) }

        const eventBus = EventBus.getInstance();

        const susbscription = await eventBus.subscribe(
            PatientCreated.eventName(),
            async (event: PatientCreated) => {
                options.createUserDto.role = Role.PATIENT;
                options.createUserDto.patientId = event.id.Value;
                await userRepository.saveUser(options.createUserDto);
            }
        );

        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new RegisterPatientApplicationService(eventBus, this.uuidGenerator, this.ormPatientRepository),
                new NestLogger()
            )
        );

        const result = await service.execute(options.dto);

        susbscription.unregister();

        return result;
    }

    @Get('appointments')
    @Roles(Role.PATIENT)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async getAppointments(@GetPatientId() id, @Query('pageIndex') pageIndex, @Query('pageSize') pageSize): Promise<Result<OrmAppointment[]>> {
        //Agregamos Paginación
        const dto: SearchPatientAppointmentsApplicationServiceDto = { id, paging: { pageIndex: (pageIndex) ? pageIndex : 0, pageSize: (pageSize) ? pageSize : 100 } };

        //Creamos el servicio de aplicación.
        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new SearchPatientAppointmentsApplicationService(this.ormAppointmentRepository),
                new NestLogger()
            )
        );

        //Ejecutamos el caso de uso
        const result = (await service.execute(dto));

        //Mapeamos y retornamos.
        return ResultMapper.map(
            result,
            (value: Appointment[]) => {
                return this.ormAppointmentMulMapper.fromDomainToOther(value)
            }
        );
    }


    @Get('profile')
    @Roles(Role.PATIENT)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async getProfile(@GetPatientId() id): Promise<Result<OrmPatient>> {

        const dto: GetPatientProfilesApplicationServiceDto = { id };

        //Creamos el servicio de aplicación.
        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new GetPatientProfilesApplicationService(this.ormPatientRepository),
                new NestLogger()
            )
        );

        //Ejecutamos el caso de uso
        const result = (await service.execute(dto));

        //Mapeamos y retornamos.
        return ResultMapper.map(
            result,
            (value: Patient) => {
                return this.ormPatientMapper.fromDomainToOther(value)
            }
        );
    }

    @Get('medical-records')
    @Roles(Role.PATIENT)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async getMedicalRecords(@GetPatientId() id, @Query('pageIndex') pageIndex, @Query('pageSize') pageSize): Promise<Result<OrmMedicalRecord[]>> {

        //Agregamos Paginación
        const dto: SearchPatientMedicalRecordsApplicationServiceDto = { id, paging: { pageIndex: (pageIndex) ? pageIndex : 0, pageSize: (pageSize) ? pageSize : 100 } };

        //Creamos el servicio de aplicación.
        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new SearchPatientMedicalRecordsApplicationService(this.ormMedicalRecordRepository),
                new NestLogger()
            )
        );

        //Ejecutamos el caso de uso
        const result = (await service.execute(dto));

        //Mapeamos y retornamos.
        return ResultMapper.map(
            result,
            (value: MedicalRecord[]) => {
                return this.ormMedicalRecordMulMapper.fromDomainToOther(value)
            }
        );
    }
}
