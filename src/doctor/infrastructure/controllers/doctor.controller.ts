import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { OrmDoctorRepository } from '../repositories/orm-doctor.repository';
import { EntityManager, getManager } from 'typeorm';
import { Doctor } from 'src/doctor/domain/doctor';
import { EventBus } from 'src/core/infrastructure/event-handler/event-bus';
import { DoctorCreated } from 'src/doctor/domain/events/doctor-created';
import { ErrorApplicationServiceDecorator } from 'src/core/application/application-service/decoratos/error-decorator/error-application.service.decorator';
import { LoggingApplicationServiceDecorator } from 'src/core/application/application-service/decoratos/logging-decorator/logging-application.service.decorator';
import { Result } from 'src/core/application/result-handler/result';
import { NestLogger } from 'src/core/infrastructure/logger/nest-logger';
import { OrmDoctor } from '../entities/orm-doctor.entity';
import { SearchDoctorsByCriteriaApplicationService, SearchDoctorsByCriteriaApplicationServiceDto } from 'src/doctor/application/services/search-doctors-by-criteria.application.service';
import { OrmDoctorMulMapper } from '../mappers/orm-doctor-mul-mapper';
import { ResultMapper } from 'src/core/application/result-handler/result.mapper';
import { UUIDGenerator } from 'src/core/infrastructure/uuid/uuid-generator';
import { SearchDoctorAppointmentsApplicationService, SearchDoctorAppointmentsApplicationServiceDto } from 'src/doctor/application/services/search-doctor-appointments.application.service';
import { OrmAppointment } from 'src/appointment/infrastructure/entities/orm.appointment.entity';
import { Appointment } from 'src/appointment/domain/appointment';
import { OrmAppointmentRepository } from 'src/appointment/infrastructure/repositories/orm-appointment.repository';
import { OrmAppointmentMulMapper } from 'src/appointment/infrastructure/mappers/orm-appointment-mul.mapper';
import { GetDoctorId } from 'src/security/users/decorators/get-doctor-id.decortator';
import { SessionGuard } from 'src/security/auth/sessions/session.guard';
import { Role } from 'src/security/users/roles/role.entity.enum';
import { Roles } from 'src/security/users/roles/roles.decorator';
import { RolesGuard } from 'src/security/users/roles/roles.guard';
import { UsersRepository } from 'src/security/users/repositories/users.repository';
import { CreateUserDto } from 'src/security/users/dtos/create-user.dto';
import { RegisterDoctorApplicationService, RegisterDoctorApplicationServiceDto } from 'src/doctor/application/services/register-doctor.application.service';
@Controller('doctor')
export class DoctorController {

    private readonly ormDoctorRepository: OrmDoctorRepository;
    private readonly ormDoctorMulMapper: OrmDoctorMulMapper = new OrmDoctorMulMapper();;
    private readonly ormAppointmentRepository: OrmAppointmentRepository;
    private readonly ormAppointmentMulMapper: OrmAppointmentMulMapper = new OrmAppointmentMulMapper();
    private readonly uuidGenerator: UUIDGenerator = new UUIDGenerator();

    constructor(private readonly manager: EntityManager) {
        if (!manager) { throw new Error("Enity manager can't be null.") }
        this.ormDoctorRepository = this.manager.getCustomRepository(OrmDoctorRepository);
        this.ormAppointmentRepository = this.manager.getCustomRepository(OrmAppointmentRepository);
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
}