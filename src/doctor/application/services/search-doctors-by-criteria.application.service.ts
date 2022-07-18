import { Doctor } from "../../../doctor/domain/doctor";
import { IApplicationService } from "../../../core/application/application-service/application.service.interface";
import { IDoctorRepository, SearchDoctorsByCriteriaDomainDto } from "../repositories/doctor.repository.inteface";
import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { DoctorSpecialtyEnum } from "src/doctor/domain/value-objects/doctor-specialty.enum";
import { DoctorNames } from "../../../doctor/domain/value-objects/doctor-names";
import { DoctorSurnames } from "../../../doctor/domain/value-objects/doctor-surnames";
import { DoctorLocation } from "../../../doctor/domain/value-objects/doctor-location";
import { DoctorRating } from "../../../doctor/domain/value-objects/doctor-rating";
import { Result } from "../../../core/application/result-handler/result";
import { DoctorSpecialty } from "src/doctor/domain/value-objects/doctor-specialty";

//#region Service DTOs
export interface SearchDoctorsByCriteriaApplicationServiceDto {
    firstName?: string;
    middleName?: string;
    firstSurname?: string;
    secondSurname?: string;
    latitude?: number;
    longitude?: number;
    rating?: number;
    specialty?: DoctorSpecialtyEnum;

    paging?: RepositoryPagingDto;
}
//#endregion

export class SearchDoctorsByCriteriaApplicationService implements IApplicationService<SearchDoctorsByCriteriaApplicationServiceDto, Doctor[]> {
    get name(): string { return this.constructor.name; }

    constructor(private readonly doctorRepository: IDoctorRepository) { }

    async execute(dto: SearchDoctorsByCriteriaApplicationServiceDto): Promise<Result<Doctor[]>> {
        //Transformamos a dominio.
        const criterias: SearchDoctorsByCriteriaDomainDto = {};
        if (dto.firstName) { criterias.names = DoctorNames.create(dto.firstName, dto.middleName); }
        if (dto.firstSurname) { criterias.surnames = DoctorSurnames.create(dto.firstSurname, dto.secondSurname); }
        if (dto.latitude && dto.longitude) { criterias.location = DoctorLocation.create(dto.latitude, dto.longitude); }
        if (dto.rating) { criterias.rating = DoctorRating.create(dto.rating); }
        if (dto.specialty) { criterias.specialty = DoctorSpecialty.create(dto.specialty); }

        //Buscamos los docores.
        const doctors = await this.doctorRepository.findDoctorByCriterias(criterias, dto.paging);
        return Result.success(doctors);
    }
}
