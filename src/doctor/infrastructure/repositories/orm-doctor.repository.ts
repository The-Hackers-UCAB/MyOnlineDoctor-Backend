import { EntityRepository, Repository } from "typeorm";
import { OrmDoctor } from "../entities/orm-doctor.entity";

import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { IDoctorRepository } from "../../../doctor/application/repositories/doctor.repository.inteface";
import { Doctor } from "../../../doctor/domain/doctor";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { DoctorLocation } from "../../../doctor/domain/value-objects/doctor-location";
import { DoctorNames } from "../../../doctor/domain/value-objects/doctor-names";
import { DoctorRating } from "../../../doctor/domain/value-objects/doctor-rating";
import { DoctorSurnames } from "../../../doctor/domain/value-objects/doctor-surnames";
import { OrmDoctorMapper } from "../mappers/orm-doctor-mapper";
import { InvalidDoctorException } from "../../../doctor/domain/exceptions/invalid-doctor.exception";
import { DoctorSpecialty } from "../../domain/value-objects/doctor-specialty";

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
        const ormDoctor = await this.findOne({ where: { id: id.Value } });
        return (ormDoctor) ? this.ormDoctorMapper.fromOtherToDomain(ormDoctor) : null;
    }

    async findOneByIdOrFail(id: DoctorId): Promise<Doctor> {
        const doctor = await this.findOneById(id);
        if (!doctor) { throw new InvalidDoctorException(); }
        return doctor;
    }

    async findDoctorByCriterias(criterias: Partial<{ names: DoctorNames; surnames: DoctorSurnames; specialty: DoctorSpecialty; location: DoctorLocation; rating: DoctorRating; }>, options: RepositoryPagingDto): Promise<Doctor[]> {
        let andWhere: boolean = false;

        const query = this.createQueryBuilder("d").leftJoin("d.specialties", "s").select(["d", "s"]);

        if (criterias?.names?.FirstName) {
            query.andWhere("LOWER(d.firstName ) LIKE LOWER(:firstName)", { firstName: `%${criterias.names.FirstName}%` });
            andWhere = true;
        }

        if (criterias?.names?.MiddleName !== undefined) {
            if (andWhere) {
                query.andWhere("LOWER(d.middleName ) LIKE LOWER(:middleName)", { middleName: `%${criterias.names.MiddleName}%` });
            }
            else {
                query.where("LOWER(d.middleName ) LIKE LOWER(:middleName)", { middleName: `%${criterias.names.MiddleName}%` });
                andWhere = true;
            }
        }

        if (criterias?.surnames?.FirstSurname) {
            if (andWhere) {
                query.andWhere("LOWER(d.firstSurname ) LIKE LOWER(:firstSurname)", { firstSurname: `%${criterias.surnames.FirstSurname}%` });
            }
            else {
                query.where("LOWER(d.firstSurname ) LIKE LOWER(:firstSurname)", { firstSurname: `%${criterias.surnames.FirstSurname}%` });
                andWhere = true;
            }
        }

        if (criterias?.surnames?.SecondSurname !== undefined) {
            if (andWhere) {
                query.andWhere("LOWER(d.secondSurname ) LIKE LOWER(:secondSurname)", { secondSurname: `%${criterias.surnames.SecondSurname}%` });
            }
            else {
                query.where("LOWER(d.secondSurname ) LIKE LOWER(:secondSurname)", { secondSurname: `%${criterias.surnames.SecondSurname}%` });
                andWhere = true;
            }
        }

        if (criterias?.location?.Latitude) {
            if (andWhere) {
                query.andWhere("d.latitude = :latitude", { latitude: criterias.location.Latitude });
            }
            else {
                query.where("d.latitude = :latitude", { latitude: criterias.location.Latitude });
                andWhere = true;
            }
        }

        if (criterias?.location?.Longitude) {
            if (andWhere) {
                query.andWhere("d.longitude = :longitude", { longitude: criterias.location.Longitude });
            }
            else {
                query.where("d.longitude = :longitude", { longitude: criterias.location.Longitude });
                andWhere = true;
            }
        }

        if (criterias?.rating?.Rating) {
            if (andWhere) {
                query.andWhere("d.rating BETWEEN :rating_start AND :rating_end", { rating_start: (criterias?.rating?.Rating - 1), rating_end: (criterias?.rating?.Rating + 1) });
            }
            else {
                query.where("d.rating BETWEEN :rating_start AND :rating_end", { rating_start: (criterias?.rating?.Rating - 1), rating_end: (criterias?.rating?.Rating + 1) });
                andWhere = true;
            }
        }

        if (criterias?.specialty) {
            if (andWhere) {
                query.andWhere("s.specialty = :specialty", { specialty: criterias.specialty.Value });
            }
            else {
                query.where("s.specialty = :specialty", { specialty: criterias.specialty.Value });
                andWhere = true;
            }
        }

        const ormDoctors = await query.skip(options.pageIndex * options.pageSize).take(options.pageSize).getMany();

        const doctors: Doctor[] = [];

        for await (const ormDoctor of ormDoctors) {
            doctors.push(await this.ormDoctorMapper.fromOtherToDomain(ormDoctor));
        }

        return doctors;
    }
}