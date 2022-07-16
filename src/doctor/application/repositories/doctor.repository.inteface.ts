import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { IRepository } from "../../../core/application/repositories/repository.interface";
import { Doctor } from "../../domain/doctor";
import { DoctorId } from "../../domain/value-objects/doctor-id";
import { DoctorLocation } from "../../domain/value-objects/doctor-location";
import { DoctorNames } from "../../domain/value-objects/doctor-names";
import { DoctorRating } from "../../domain/value-objects/doctor-rating";
import { DoctorSpecialty } from "../../domain/value-objects/doctor-specialty.enum";
import { DoctorSurnames } from "../../domain/value-objects/doctor-surnames";

export interface IDoctorRepository extends IRepository<DoctorId, Doctor> {
    findDoctorByCriterias(criterias: Partial<{ names: DoctorNames, surnames: DoctorSurnames, specialty: DoctorSpecialty, location: DoctorLocation, rating: DoctorRating }>, options: RepositoryPagingDto): Promise<Doctor[]>;
}