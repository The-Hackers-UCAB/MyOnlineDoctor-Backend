import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrmPatientRepository } from '../repositories/orm-patient.repository';
import { EntityManager } from 'typeorm';
import { PatientNames } from 'src/patient/domain/value-objects/patient-names';
import { Patient } from 'src/patient/domain/patient';
import { PatientId } from 'src/patient/domain/value-objects/patient-id';
import { PatientSurnames } from 'src/patient/domain/value-objects/patient-surnames';
import { PatientBirthdate } from 'src/patient/domain/value-objects/patient-birthdate';
import { PatientAllergies } from 'src/patient/domain/value-objects/patient-allergies';
import { PatientBackground } from 'src/patient/domain/value-objects/patient-background';
import { PatientHeight } from 'src/patient/domain/value-objects/patient-height';
import { PatientWeight } from 'src/patient/domain/value-objects/patient-weight';
import { PatientPhoneNumber } from 'src/patient/domain/value-objects/patient-phone-number';
import { PatientSurgeries } from 'src/patient/domain/value-objects/patient-surgeries';
import { PatientStatus } from 'src/patient/domain/value-objects/patient-status';
import { PatientGender } from 'src/patient/domain/value-objects/patient-gender';
import { OrmPatientMapper } from '../mappers/orm-patient-mapper';
import { ErrorApplicationServiceDecorator } from 'src/core/application/application-service/decoratos/error-decorator/error-application-service.decorator';
import { LoggingApplicationServiceDecorator } from 'src/core/application/application-service/decoratos/logging-decorator/logging-application-service.decorator';
import { Result } from 'src/core/application/result-handler/result';
import { NestLogger } from 'src/core/infrastructure/logger/nest-logger';
import { SearchAssociatedPatientsApplicationService, SearchAssociatedPatientsApplicationServiceRequest } from 'src/patient/application/services/search-associated-patients.application.service';
import { OrmPatientMulMapper } from '../mappers/orm-patient-mul-mapper';
import { EventBus } from '../../../core/infrastructure/event-handler/event-bus';
import { PatientCreated } from 'src/patient/domain/events/patient-created.event';


@Controller('patient')
export class PatientController {

    private readonly ormPatientRepository: OrmPatientRepository;
    private readonly ormPatientMulMapper: OrmPatientMulMapper;

    constructor( private readonly manager: EntityManager){
        if (!manager) { throw new Error("Entity manager can't be null"); }
        this.ormPatientRepository = manager.getCustomRepository(OrmPatientRepository);
        this.ormPatientMulMapper = new OrmPatientMulMapper();
    }

    @Post('searchPatients')
    async getAssociatedPatients(
        @Body() request: SearchAssociatedPatientsApplicationServiceRequest, 
        @Query('pageIndex') pageIndex, 
        @Query('pageSize') pageSize) {
        request.paging = {pageIndex: (pageIndex) ? pageIndex : 0, pageSize: (pageSize) ? pageSize : 100};
            
        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new SearchAssociatedPatientsApplicationService(this.ormPatientRepository),
                new NestLogger()
            )
        );

        const result = await service.execute(request);

        return (result.IsSuccess) ? Result.success(await this.ormPatientMulMapper.fromDomainToOther(result.Value)) : result;
    
    }

    @Get('/Patient:id')
    async getPatient(@Param('id') id: number) {
        return this.ormPatientRepository.findOneByIdOrFail(PatientId.create(id));
    }

    @Post('registerPatient')
    async registerPatient(): Promise<{msg : string}> {
        await EventBus.getInstance().subscribe(
            PatientCreated.eventName(),
            (event: PatientCreated) => {
                console.log("Se Publico el Evento");
            }
        );

        const patient = Patient.create(
            PatientId.create(35),
            PatientNames.create("Santiago"),
            PatientSurnames.create("Figueroa"),
            PatientBirthdate.create( new Date("2000-09-01")),
            PatientAllergies.create("Ninguna"),
            PatientBackground.create("Ninguna"),
            PatientHeight.create(1.85),
            PatientPhoneNumber.create("0424-1234567"),
            PatientStatus.ACTIVE,
            PatientWeight.create(70),
            PatientSurgeries.create("Ninguna"),
            PatientGender.MALE);

        this.ormPatientRepository.saveAggregate(patient);

        EventBus.getInstance().publish(patient.pullEvents());

        return { msg: "Paciente Registrado" };

    }
}