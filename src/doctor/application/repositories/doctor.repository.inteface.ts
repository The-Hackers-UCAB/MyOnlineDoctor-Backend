import { DoctorLocation } from "../../../doctor/domain/value-objects/doctor-location";
import { DoctorNames } from "../../../doctor/domain/value-objects/doctor-names";
import { DoctorRating } from "../../../doctor/domain/value-objects/doctor-rating";
import { DoctorSurnames } from "../../../doctor/domain/value-objects/doctor-surnames";
import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { IRepository } from "../../../core/application/repositories/repository.interface";
import { DoctorSpecialty } from "../../domain/value-objects/doctor-specialty";
import { Doctor } from "../../domain/doctor";
import { DoctorId } from "../../domain/value-objects/doctor-id";

//#region IDoctorRepository DTOs

export class SearchDoctorsByCriteriaDomainDto {
    names?: DoctorNames;
    surnames?: DoctorSurnames;
    specialty?: DoctorSpecialty;
    location?: DoctorLocation;
    rating?: DoctorRating;
}

//#endregion

export interface IDoctorRepository extends IRepository<DoctorId, Doctor> {
    findDoctorByCriterias(criterias: SearchDoctorsByCriteriaDomainDto, options: RepositoryPagingDto): Promise<Doctor[]>;
}