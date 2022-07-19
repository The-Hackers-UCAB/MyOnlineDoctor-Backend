import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { OrmPatientRepository } from '../repositories/orm-patient.repository';
import { EntityManager, getManager } from 'typeorm';
import { ErrorApplicationServiceDecorator } from 'src/core/application/application-service/decoratos/error-decorator/error-application.service.decorator';
import { LoggingApplicationServiceDecorator } from 'src/core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator';
import { Result } from 'src/core/application/result-handler/result';
import { NestLogger } from 'src/core/infrastructure/logger/nest-logger';
import { EventBus } from '../../../core/infrastructure/event-handler/event-bus';
import { PatientCreated } from 'src/patient/domain/events/patient-created.event';

import { CreateUserDto } from 'src/security/users/dtos/create-user.dto';
import { UsersRepository } from 'src/security/users/repositories/users.repository';
import { Role } from 'src/security/users/roles/role.entity.enum';
import { UUIDGenerator } from 'src/core/infrastructure/uuid/uuid-generator';
import { RegisterPatientApplicationServiceDto, RegisterPatientApplicationService } from 'src/patient/application/services/register-patient.application.service';
import { Appointment } from 'src/appointment/domain/appointment';
import { SearchPatientAppointmentsApplicationService, SearchPatientAppointmentsApplicationServiceDto } from 'src/patient/application/services/search-patient-appointment.application.service';
import { OrmAppointmentRepository } from 'src/appointment/infrastructure/repositories/orm-appointment.repository';
import { ResultMapper } from 'src/core/application/result-handler/result.mapper';
import { OrmAppointmentMulMapper } from 'src/appointment/infrastructure/mappers/orm-appointment-mul.mapper';
import { OrmAppointment } from 'src/appointment/infrastructure/entities/orm.appointment.entity';
import { SessionGuard } from 'src/security/auth/sessions/session.guard';
import { Roles } from 'src/security/users/roles/roles.decorator';
import { RolesGuard } from 'src/security/users/roles/roles.guard';
import { GetPatientId } from 'src/security/users/decorators/get-patient-id.decorator';

@Controller('patient')
export class PatientController {

    private readonly ormPatientRepository: OrmPatientRepository;
    private readonly ormAppointmentRepository: OrmAppointmentRepository;
    private readonly ormAppointmentMulMapper: OrmAppointmentMulMapper = new OrmAppointmentMulMapper();
    private readonly uuidGenerator: UUIDGenerator = new UUIDGenerator();

    constructor(private readonly manager: EntityManager) {
        if (!manager) { throw new Error("Entity manager can't be null"); }
        this.ormPatientRepository = this.manager.getCustomRepository(OrmPatientRepository);
        this.ormAppointmentRepository = this.manager.getCustomRepository(OrmAppointmentRepository);
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
}
