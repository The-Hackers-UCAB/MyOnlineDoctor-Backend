import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { OrmDoctorRepository } from '../repositories/orm-doctor.repository';
import { EntityManager, getManager } from 'typeorm';
import { Doctor } from '../../../doctor/domain/doctor';
import { EventBus } from '../../../core/infrastructure/event-handler/event-bus';
import { DoctorCreated } from '../../../doctor/domain/events/doctor-created';
import { ErrorApplicationServiceDecorator } from '../../../core/application/application-service/decoratos/error-decorator/error-application.service.decorator';
import { LoggingApplicationServiceDecorator } from '../../../core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator';
import { Result } from '../../../core/application/result-handler/result';
import { NestLogger } from '../../../core/infrastructure/logger/nest-logger';
import { OrmDoctor } from '../entities/orm-doctor.entity';
import { SearchDoctorsByCriteriaApplicationService, SearchDoctorsByCriteriaApplicationServiceDto } from '../../../doctor/application/services/search-doctors-by-criteria.application.service';
import { OrmDoctorMulMapper } from '../mappers/orm-doctor-mul-mapper';
import { ResultMapper } from '../../../core/application/result-handler/result.mapper';
import { UUIDGenerator } from '../../../core/infrastructure/uuid/uuid-generator';
import { SearchDoctorAppointmentsApplicationService, SearchDoctorAppointmentsApplicationServiceDto } from '../../../doctor/application/services/search-doctor-appointments.application.service';
import { OrmAppointment } from '../../../appointment/infrastructure/entities/orm.appointment.entity';
import { Appointment } from '../../../appointment/domain/appointment';
import { OrmAppointmentRepository } from '../../../appointment/infrastructure/repositories/orm-appointment.repository';
import { OrmAppointmentMulMapper } from '../../../appointment/infrastructure/mappers/orm-appointment-mul.mapper';
import { RegisterDoctorApplicationService, RegisterDoctorApplicationServiceDto } from '../../../doctor/application/services/register-doctor.application.service';
import { SessionGuard } from '../../../core/infrastructure/security/auth/sessions/session.guard';
import { GetDoctorId } from '../../../core/infrastructure/security/users/decorators/get-doctor-id.decortator';
import { CreateUserDto } from '../../../core/infrastructure/security/users/dtos/create-user.dto';
import { UsersRepository } from '../../../core/infrastructure/security/users/repositories/users.repository';
import { Role } from '../../../core/infrastructure/security/users/roles/role.entity.enum';
import { Roles } from '../../../core/infrastructure/security/users/roles/roles.decorator';
import { RolesGuard } from '../../../core/infrastructure/security/users/roles/roles.guard';
import { OrmPatient } from '../../../../src/patient/infrastructure/entities/orm-patient.entity';
import { SearchDoctorPatientsApplicationService, SearchDoctorPatientsApplicationServiceDto } from '../../../../src/doctor/application/services/search-doctor-patients.application.service';
import { Patient } from '../../../../src/patient/domain/patient';
import { OrmPatientMulMapper } from '../../../../src/patient/infrastructure/mappers/orm-patient-mul-mapper';
import { OrmMedicalRecordRepository } from '../../../../src/medical-record/infrastructure/repositories/orm-medical-record.repository';
import { OrmMedicalRecordMulMapper } from '../../../../src/medical-record/infrastructure/mappers/orm-medical-record-mul.mapper';
import { OrmMedicalRecord } from '../../../../src/medical-record/infrastructure/entities/orm.medical-record.entity';
import { SearchDoctorMedicalRecordsApplicationService, SearchDoctorMedicalRecordsApplicationServiceDto } from '../../../../src/doctor/application/services/search-doctor-medical-record.application.service';
import { MedicalRecord } from '../../../../src/medical-record/domain/medical-record';

@Controller('doctor')
export class DoctorController {

    private readonly ormDoctorRepository: OrmDoctorRepository;
    private readonly ormDoctorMulMapper: OrmDoctorMulMapper = new OrmDoctorMulMapper();;
    private readonly ormAppointmentRepository: OrmAppointmentRepository;
    private readonly ormAppointmentMulMapper: OrmAppointmentMulMapper = new OrmAppointmentMulMapper();
    private readonly ormPatientMulMapper: OrmPatientMulMapper = new OrmPatientMulMapper();
    private readonly ormMedicalRecordRepository: OrmMedicalRecordRepository;
    private readonly ormMedicalRecordMulMapper: OrmMedicalRecordMulMapper = new OrmMedicalRecordMulMapper();
    private readonly uuidGenerator: UUIDGenerator = new UUIDGenerator();

    constructor(private readonly manager: EntityManager) {
        if (!manager) { throw new Error("Enity manager can't be null.") }
        this.ormDoctorRepository = this.manager.getCustomRepository(OrmDoctorRepository);
        this.ormAppointmentRepository = this.manager.getCustomRepository(OrmAppointmentRepository);
        this.ormMedicalRecordRepository = this.manager.getCustomRepository(OrmMedicalRecordRepository);
    }

    @Post('')
    async registerDoctor(@Body() options: { dto: RegisterDoctorApplicationServiceDto, createUserDto: CreateUserDto }): Promise<Result<string>> {
        const userRepository = getManager().getCustomRepository(UsersRepository);

        if (await userRepository.findOne({ where: { email: options.createUserDto.email } })) { return Result.fail(new Error("Este usuario ya se encuentra regsitrado.")) }

        const eventBus = EventBus.getInstance();

        const susbscription = await eventBus.subscribe(
            DoctorCreated.eventName(),
            async (event: DoctorCreated) => {
                options.createUserDto.role = Role.DOCTOR;
                options.createUserDto.doctorId = event.id.Value;
                await userRepository.saveUser(options.createUserDto);
            }
        );

        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new RegisterDoctorApplicationService(eventBus, this.uuidGenerator, this.ormDoctorRepository),
                new NestLogger()
            )
        );

        const result = await service.execute(options.dto);

        susbscription.unregister();

        return result;
    }

    @Post('search')
    async getDoctorsByCriteria(@Body() dto: SearchDoctorsByCriteriaApplicationServiceDto, @Query('pageIndex') pageIndex, @Query('pageSize') pageSize): Promise<Result<OrmDoctor[]>> {
        //Agregamos Paginación
        dto.paging = { pageIndex: (pageIndex) ? pageIndex : 0, pageSize: (pageSize) ? pageSize : 100 };

        //Creamos el servicio de aplicación.
        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new SearchDoctorsByCriteriaApplicationService(this.ormDoctorRepository),
                new NestLogger()
            )
        );

        //Ejecutamos el caso de uso
        const result = (await service.execute(dto));

        //Mapeamos y retornamos.
        return ResultMapper.map(
            result,
            (value: Doctor[]) => {
                return this.ormDoctorMulMapper.fromDomainToOther(value)
            }
        );
    }

    @Get('appointments')
    @Roles(Role.DOCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async getAppointments(@GetDoctorId() id, @Query('pageIndex') pageIndex, @Query('pageSize') pageSize): Promise<Result<OrmAppointment[]>> {
        //Agregamos Paginación
        const dto: SearchDoctorAppointmentsApplicationServiceDto = { id, paging: { pageIndex: (pageIndex) ? pageIndex : 0, pageSize: (pageSize) ? pageSize : 100 } };

        //Creamos el servicio de aplicación.
        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new SearchDoctorAppointmentsApplicationService(this.ormAppointmentRepository),
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
    @Get('patients')
    @Roles(Role.DOCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async getPatients(@GetDoctorId() id): Promise<Result<OrmPatient[]>> {

        const dto: SearchDoctorPatientsApplicationServiceDto = { id }

        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new SearchDoctorPatientsApplicationService(this.ormAppointmentRepository),
                new NestLogger()
            )
        )

        const result = (await service.execute(dto));

        return ResultMapper.map(
            result,
            (value: Patient[]) => {
                return this.ormPatientMulMapper.fromDomainToOther(value)
            }
        );

    }

    @Get('medical-records')
    @Roles(Role.DOCTOR)
    @UseGuards(RolesGuard)
    @UseGuards(SessionGuard)
    async getMedicalRecords(@GetDoctorId() id, @Query('pageIndex') pageIndex, @Query('pageSize') pageSize): Promise<Result<OrmMedicalRecord[]>> {

        //Agregamos Paginación
        const dto: SearchDoctorMedicalRecordsApplicationServiceDto = { id, paging: { pageIndex: (pageIndex) ? pageIndex : 0, pageSize: (pageSize) ? pageSize : 100 } };

        //Creamos el servicio de aplicación.
        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new SearchDoctorMedicalRecordsApplicationService(this.ormMedicalRecordRepository),
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