import { DoctorRatingDomainService } from "../../domain/domain-services/doctor-rating.domain.service";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { DoctorLocation } from "../../../doctor/domain/value-objects/doctor-location";
import { DoctorNames } from "../../../doctor/domain/value-objects/doctor-names";
import { DoctorRating } from "../../../doctor/domain/value-objects/doctor-rating";
import { DoctorSurnames } from "../../../doctor/domain/value-objects/doctor-surnames";
import { IMapper } from "../../../core/application/mappers/mapper.interface";
import { Doctor } from "../../../doctor/domain/doctor";
import { OrmDoctor } from "../entities/orm-doctor.entity";
import { DoctorSpecialty } from "../../domain/value-objects/doctor-specialty";
import { DoctorGender } from "../../../doctor/domain/value-objects/doctor-gender";
import { DoctorStatus } from "../../../doctor/domain/value-objects/doctor-status";

export class OrmDoctorMapper implements IMapper<Doctor, OrmDoctor>{

    constructor(private readonly doctorRatingDomainService = new DoctorRatingDomainService()) { }

    async fromDomainToOther(domain: Doctor): Promise<OrmDoctor> {
        //Verificamos que no sea null
        if (!domain) { return null; }

        //Creamos un objeto de doctor de tipo ORM.
        const ormDoctor: OrmDoctor = await OrmDoctor.create(
            domain.Id.Value,
            domain.Names.FirstName,
            domain.Surnames.FirstSurname,
            domain.Gender.Value,
            domain.Status.Value,
            domain.Location.Latitude,
            domain.Location.Longitude,
            domain.Rating.Rating,
            domain.Specialties,
            domain.Names.MiddleName,
            domain.Surnames.SecondSurname
        );

        return ormDoctor;
    }

    async fromOtherToDomain(other: OrmDoctor): Promise<Doctor> {
        //Verificamos que no sea null
        if (!other) { return null; }

        //Transformamos las especialidades del ORM a domain.
        const specialties: DoctorSpecialty[] = [];
        other.specialties.forEach((specialty) => {
            specialties.push(DoctorSpecialty.create(specialty.specialty));
        });

        //Creamos el objeto de Doctor de dominio.
        const doctor: Doctor = Doctor.create(
            DoctorId.create(other.id),
            DoctorNames.create(other.firstName, other.middleName),
            DoctorSurnames.create(other.firstSurname, other.secondSurname),
            DoctorLocation.create(other.latitude, other.longitude),
            DoctorRating.create(other.rating),
            DoctorGender.create(other.gender),
            DoctorStatus.create(other.status),
            specialties
        );

        //Removemos los eventos ya que se está restaurando mas no creado
        doctor.pullEvents();

        return doctor;
    }
}