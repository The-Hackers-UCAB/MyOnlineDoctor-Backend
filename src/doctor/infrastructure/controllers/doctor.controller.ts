import { Controller, Get, Param, Post } from '@nestjs/common';
import { OrmDoctorRepository } from '../repositories/orm-doctor.repository';
import { EntityManager } from 'typeorm';
import { DoctorNames } from 'src/doctor/domain/value-objects/doctor-names';
import { Doctor } from 'src/doctor/domain/doctor';
import { DoctorRatingDomainService } from 'src/doctor/domain/domain-services/doctor-rating-domain-service';
import { DoctorGender } from 'src/doctor/domain/value-objects/doctor-gender.enum';
import { DoctorId } from 'src/doctor/domain/value-objects/doctor-id';
import { DoctorLocation } from 'src/doctor/domain/value-objects/doctor-location';
import { DoctorRating } from 'src/doctor/domain/value-objects/doctor-rating';
import { DoctorSpecialty } from 'src/doctor/domain/value-objects/doctor-specialty.enum';
import { DoctorStatus } from 'src/doctor/domain/value-objects/doctor-status.enum';
import { DoctorSurnames } from 'src/doctor/domain/value-objects/doctor-surnames';

@Controller('doctor')
export class DoctorController {

    private readonly ormDoctorRepository: OrmDoctorRepository;

    constructor(private readonly manager: EntityManager) {
        this.ormDoctorRepository = manager.getCustomRepository(OrmDoctorRepository);
    }

    @Post('')
    async register(): Promise<{ msg: string }> {
        const doctor = Doctor.create(
            DoctorId.create(10),
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

        this.ormDoctorRepository.saveAggregate(doctor);

        return { msg: "Doctor Registrado" };
    }

    @Get('/:id')
    async getDoctorById(@Param('id') id: number) {
        return this.ormDoctorRepository.findOneByIdOrFail(DoctorId.create(id));
    }
}
