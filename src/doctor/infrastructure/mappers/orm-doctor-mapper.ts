import { DoctorRatingDomainService } from "../../../doctor/domain/domain-services/doctor-rating-domain-service";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { DoctorLocation } from "../../../doctor/domain/value-objects/doctor-location";
import { DoctorNames } from "../../../doctor/domain/value-objects/doctor-names";
import { DoctorRating } from "../../../doctor/domain/value-objects/doctor-rating";
import { DoctorSpecialty } from "../../../doctor/domain/value-objects/doctor-specialty.enum";
import { DoctorSurnames } from "../../../doctor/domain/value-objects/doctor-surnames";
import { IMapper } from "../../../core/application/mappers/mapper.interface";
import { Doctor } from "../../../doctor/domain/doctor";
import { OrmDoctor } from "../entities/orm-doctor.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrmDoctorMapper implements IMapper<Doctor, OrmDoctor>{

    constructor(private readonly doctorRatingDomainService = new DoctorRatingDomainService()) { }

    fromDomainToOther(domain: Doctor): OrmDoctor {
        //Creamos un objeto de doctor de tipo ORM.
        const ormDoctor: OrmDoctor = OrmDoctor.create(
            domain.Id.value,
            domain.Names.FirstName,
            domain.Surnames.FirstSurname,
            domain.Gender,
            domain.Status,
            domain.Location.Latitude,
            domain.Location.Longitude,
            domain.Rating.Count,
            domain.Rating.Total,
            domain.Rating.Score,
            domain.Specialties,
            domain.Names.MiddleName,
            domain.Surnames.SecondSurname
        );

        return ormDoctor;
    }

    fromOtherToDomain(other: OrmDoctor): Doctor {
        //Transformamos las especialidades del ORM a domain.
        const specialties: DoctorSpecialty[] = [];
        other.specialties.forEach((specialty) => {
            specialties.push(specialty.specialty);
        });

        //Creamos el objeto de Doctor de dominio.
        const doctor: Doctor = Doctor.create(
            DoctorId.create(other.id),
            DoctorNames.create(other.firstName, other.middleName),
            DoctorSurnames.create(other.firstSurname, other.middleName),
            DoctorLocation.create(other.latitude, other.longitude),
            DoctorRating.create(
                other.count,
                other.total,
                this.doctorRatingDomainService.execute({
                    count: other.count,
                    total: other.total
                })
            ),
            other.gender,
            other.status,
            specialties
        );

        return doctor;
    }
}