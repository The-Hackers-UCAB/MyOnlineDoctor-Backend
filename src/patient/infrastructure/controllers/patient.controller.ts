import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrmPatientRepository } from '../repositories/orm-patient.repository';
import { EntityManager, getManager } from 'typeorm';
import { PatientId } from 'src/patient/domain/value-objects/patient-id';
import { ErrorApplicationServiceDecorator } from 'src/core/application/application-service/decoratos/error-decorator/error-application-service.decorator';
import { LoggingApplicationServiceDecorator } from 'src/core/application/application-service/decoratos/logging-decorator/logging-application-service.decorator';
import { Result } from 'src/core/application/result-handler/result';
import { NestLogger } from 'src/core/infrastructure/logger/nest-logger';
import { SearchAssociatedPatientsApplicationService, SearchAssociatedPatientsApplicationServiceRequest } from 'src/patient/application/services/search-associated-patients.application.service';
import { OrmPatientMulMapper } from '../mappers/orm-patient-mul-mapper';
import { EventBus } from '../../../core/infrastructure/event-handler/event-bus';
import { PatientCreated } from 'src/patient/domain/events/patient-created.event';
import { UUIDGenerator } from 'src/core/infrastructure/uuid/uuid-generator';
import { RegisterPatientApplicationService, RegisterPatientApplicationServiceRequest } from 'src/patient/application/services/register-patient.application.service';
import { CreateUserDto } from 'src/security/users/dtos/create-user.dto';
import { UsersRepository } from 'src/security/users/repositories/users.repository';
import { Role } from 'src/security/users/roles/role.entity.enum';

@Controller('patient')
export class PatientController {

    private readonly ormPatientRepository: OrmPatientRepository;
    private readonly ormPatientMulMapper: OrmPatientMulMapper;

    constructor(private readonly manager: EntityManager) {
        if (!manager) { throw new Error("Entity manager can't be null"); }
        this.ormPatientRepository = this.manager.getCustomRepository(OrmPatientRepository);
        this.ormPatientMulMapper = new OrmPatientMulMapper();
    }

    @Post('')
    async registerPatient(@Body() options: { registerPatientApplicationServiceRequest: RegisterPatientApplicationServiceRequest, createUserDto: CreateUserDto }): Promise<Result<string>> {
        const userRepository = getManager().getCustomRepository(UsersRepository);

        if (await userRepository.findOne({ where: { email: options.createUserDto.email } })) { return Result.fail(new Error("Este usuario ya se encuentra regsitrado.")) }

        const eventBus = EventBus.getInstance();
        options.registerPatientApplicationServiceRequest.id = UUIDGenerator.generate();

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
                new RegisterPatientApplicationService(eventBus, this.ormPatientRepository),
                new NestLogger()
            )
        );

        const result = await service.execute(options.registerPatientApplicationServiceRequest);

        susbscription.unregister();

        return result;
    }

    @Post('search')
    async getAssociatedPatients(@Body() request: SearchAssociatedPatientsApplicationServiceRequest, @Query('pageIndex') pageIndex, @Query('pageSize') pageSize) {
        request.paging = { pageIndex: (pageIndex) ? pageIndex : 0, pageSize: (pageSize) ? pageSize : 100 };

        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new SearchAssociatedPatientsApplicationService(this.ormPatientRepository),
                new NestLogger()
            )
        );

        const result = await service.execute(request);

        return (result.IsSuccess) ? Result.success(await this.ormPatientMulMapper.fromDomainToOther(result.Value)) : result;
    }

    @Get(':id')
    async getPatient(@Param('id') id: string) {
        return this.ormPatientRepository.findOneByIdOrFail(PatientId.create(id));
    }
}
