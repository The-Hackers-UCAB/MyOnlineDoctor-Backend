import { Between, EntityRepository, Repository } from "typeorm";
import { OrmDoctor } from "../entities/orm-doctor.entity";

import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { IDoctorRepository } from "../../../doctor/application/repositories/doctor.repository.inteface";
import { Doctor } from "../../../doctor/domain/doctor";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { DoctorLocation } from "../../../doctor/domain/value-objects/doctor-location";
import { DoctorNames } from "../../../doctor/domain/value-objects/doctor-names";
import { DoctorRating } from "../../../doctor/domain/value-objects/doctor-rating";
import { DoctorSpecialty } from "../../../doctor/domain/value-objects/doctor-specialty.enum";
import { DoctorSurnames } from "../../../doctor/domain/value-objects/doctor-surnames";
import { OrmDoctorMapper } from "../mappers/orm-doctor-mapper";
import { OrmDoctorCriteriasDto } from "../dtos/orm-doctor-criterias.dto";
import { InvalidDoctorException } from "../../../doctor/domain/exceptions/invalid-doctor.exception";

@EntityRepository(OrmDoctor)
export class OrmDoctorRepository extends Repository<OrmDoctor> implements IDoctorRepository {
    private readonly ormDoctorMapper: OrmDoctorMapper;

    constructor() {
        super();
        this.ormDoctorMapper = new OrmDoctorMapper();
    }

    async saveAggregate(aggregate: Doctor): Promise<void> {
        const ormDoctor = await this.ormDoctorMapper.fromDomainToOther(aggregate);
        await this.save(ormDoctor);
    }

    async findOneById(id: DoctorId): Promise<Doctor> {
        const ormDoctor = await this.findOne({ where: { id: id.value } });
        return (ormDoctor) ? this.ormDoctorMapper.fromOtherToDomain(ormDoctor) : null;
    }

    async findOneByIdOrFail(id: DoctorId): Promise<Doctor> {
        const doctor = await this.findOneById(id);
        if (!doctor) { throw new InvalidDoctorException(); }
        return doctor;
    }

    async findDoctorByCriterias(criterias: Partial<{ names: DoctorNames; surnames: DoctorSurnames; specialty: DoctorSpecialty; location: DoctorLocation; rating: DoctorRating; }>, options: RepositoryPagingDto): Promise<Doctor[]> {
        const ormCriterias: OrmDoctorCriteriasDto = {};

        if (criterias?.names?.FirstName) { ormCriterias.firstName = criterias.names.FirstName; }
        if (criterias?.names?.MiddleName) { ormCriterias.middleName = criterias.names.MiddleName; }
        if (criterias?.surnames?.FirstSurname) { ormCriterias.firstSurname = criterias.surnames.FirstSurname; }
        if (criterias?.surnames?.SecondSurname) { ormCriterias.secondSurname = criterias.surnames.SecondSurname; }
        if (criterias?.location?.Latitude) { ormCriterias.latitude = criterias.location.Latitude; }
        if (criterias?.location?.Longitude) { ormCriterias.longitude = criterias.location.Longitude; }
        if (criterias?.rating?.Score) { ormCriterias.rating = criterias.rating.Score; }

        const ormDoctors: OrmDoctor[] = await this.find({
            where: {
                firstName: ormCriterias.firstName,
                middleName: ormCriterias.middleName,
                firstSurname: ormCriterias.firstSurname,
                secondSurname: ormCriterias.secondSurname,
                latitude: ormCriterias.latitude,
                longitude: ormCriterias.longitude,
                rating: Between(ormCriterias.rating - 1, ormCriterias.rating + 1),
                specialties: { specialty: ormCriterias.specialty }
            },
            skip: options.pageIndex * options.pageSize, take: options.pageSize
        });

        const doctors: Doctor[] = [];

        for await (const ormDoctor of ormDoctors) {
            doctors.push(await this.ormDoctorMapper.fromOtherToDomain(ormDoctor));
        }

        return doctors;
    }
}