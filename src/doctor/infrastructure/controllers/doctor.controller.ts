import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrmDoctorRepository } from '../repositories/orm-doctor.repository';
import { EntityManager } from 'typeorm';
import { DoctorNames } from 'src/doctor/domain/value-objects/doctor-names';
import { Doctor } from 'src/doctor/domain/doctor';
import { DoctorRatingDomainService } from 'src/doctor/domain/domain-services/doctor-rating-domain-service';
import { DoctorId } from 'src/doctor/domain/value-objects/doctor-id';
import { DoctorLocation } from 'src/doctor/domain/value-objects/doctor-location';
import { DoctorRating } from 'src/doctor/domain/value-objects/doctor-rating';
import { DoctorSurnames } from 'src/doctor/domain/value-objects/doctor-surnames';
import { EventBus } from 'src/core/infrastructure/event-handler/event-bus';
import { DoctorCreated } from 'src/doctor/domain/events/doctor-created';
import { OrmDoctorMapper } from '../mappers/orm-doctor-mapper';
import { ErrorApplicationServiceDecorator } from 'src/core/application/application-service/decoratos/error-decorator/error-application-service.decorator';
import { LoggingApplicationServiceDecorator } from 'src/core/application/application-service/decoratos/logging-decorator/logging-application-service.decorator';
import { Result } from 'src/core/application/result-handler/result';
import { NestLogger } from 'src/core/infrastructure/logger/nest-logger';
import { OrmDoctor } from '../entities/orm-doctor.entity';
import { SearchDoctorsByCriteriaApplicationService, SearchDoctorsByCriteriaApplicationServiceRequest } from 'src/doctor/application/services/search-doctors-by-criteria.application.service';
import { DoctorSpecialty } from 'src/doctor/domain/value-objects/doctor-specialty';
import { DoctorSpecialtyEnum } from 'src/doctor/domain/value-objects/doctor-specialty.enum';
import { DoctorGender } from 'src/doctor/domain/value-objects/doctor-gender';
import { DoctorGenderEnum } from 'src/doctor/domain/value-objects/doctor-gender.enum';
import { DoctorStatus } from 'src/doctor/domain/value-objects/doctor-status';
import { DoctorStatusEnum } from 'src/doctor/domain/value-objects/doctor-status.enum';
import { OrmDoctorMulMapper } from '../mappers/orm-doctor-mul-mapper';

@Controller('doctor')
export class DoctorController {

    private readonly ormDoctorRepository: OrmDoctorRepository;
    private readonly ormDoctorMulMapper: OrmDoctorMulMapper;

    constructor(private readonly manager: EntityManager) {
        if (!manager) { throw new Error("Enity manager can't be null.") }
        this.ormDoctorRepository = manager.getCustomRepository(OrmDoctorRepository);
        this.ormDoctorMulMapper = new OrmDoctorMulMapper();
    }

    @Post('search')
    async getDoctorsByCriteria(@Body() searchDoctorsByCriteriaApplicationServiceRequest: SearchDoctorsByCriteriaApplicationServiceRequest, @Query('pageIndex') pageIndex, @Query('pageSize') pageSize) {
        //Agregamos Paginación
        searchDoctorsByCriteriaApplicationServiceRequest.paging = { pageIndex: (pageIndex) ? pageIndex : 0, pageSize: (pageSize) ? pageSize : 100 };

        //Creamos el servicio de aplicación.
        const service = new ErrorApplicationServiceDecorator(
            new LoggingApplicationServiceDecorator(
                new SearchDoctorsByCriteriaApplicationService(this.ormDoctorRepository),
                new NestLogger()
            )
        );

        //Ejecutamos el caso de uso
        const result = (await service.execute(searchDoctorsByCriteriaApplicationServiceRequest));

        return (result.IsSuccess) ? Result.success(await this.ormDoctorMulMapper.fromDomainToOther(result.Value)) : result;
    }

    //#region EXTRAS

    @Get('/:id')
    async getDoctorById(@Param('id') id: number) {
        return this.ormDoctorRepository.findOneByIdOrFail(DoctorId.create(id));
    }

    @Post('')
    async register(): Promise<{ msg: string }> {

        await EventBus.getInstance().subscribe(
            DoctorCreated.eventName(),
            (event: DoctorCreated) => {
                console.log("Hola se publico un evento.");
            }
        );

        const doctor = Doctor.create(
            DoctorId.create(10),
            DoctorNames.create("Susan"),
            DoctorSurnames.create("Smith"),
            DoctorLocation.create(-5, -152),
            DoctorRating.create(
                10, 150,
                (new DoctorRatingDomainService()).execute({ count: 10, total: 150 })
            ),
            DoctorGender.create(DoctorGenderEnum.FEMALE),
            DoctorStatus.create(DoctorStatusEnum.ACTIVE),
            [DoctorSpecialty.create(DoctorSpecialtyEnum.UROLOGY), DoctorSpecialty.create(DoctorSpecialtyEnum.NEPHROLOGY)]
        );

        this.ormDoctorRepository.saveAggregate(doctor);

        EventBus.getInstance().publish(doctor.pullEvents());

        return { msg: "Doctor Registrado" };
    }

    //#endregion
}