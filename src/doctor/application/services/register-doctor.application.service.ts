import { IApplicationService } from "src/core/application/application-service/application-service.interface";
import { IEventHandler } from "src/core/application/event-handler/event-handler.interface";
import { Result } from "src/core/application/result-handler/result";
import { Doctor } from "src/doctor/domain/doctor";
import { DoctorGender } from "src/doctor/domain/value-objects/doctor-gender";
import { DoctorGenderEnum } from "src/doctor/domain/value-objects/doctor-gender.enum";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { DoctorLocation } from "src/doctor/domain/value-objects/doctor-location";
import { DoctorNames } from "src/doctor/domain/value-objects/doctor-names";
import { DoctorRating } from "src/doctor/domain/value-objects/doctor-rating";
import { DoctorSpecialty } from "src/doctor/domain/value-objects/doctor-specialty";
import { DoctorSpecialtyEnum } from "src/doctor/domain/value-objects/doctor-specialty.enum";
import { DoctorStatus } from "src/doctor/domain/value-objects/doctor-status";
import { DoctorStatusEnum } from "src/doctor/domain/value-objects/doctor-status.enum";
import { DoctorSurnames } from "src/doctor/domain/value-objects/doctor-surnames";
import { IDoctorRepository } from "../repositories/doctor.repository.inteface";

//#region Service DTOs
export interface RegisterDoctorApplicationServiceRequest {
    id: string;
    firstName: string;
    firstSurname: string;
    gender: DoctorGenderEnum;
    latitude: number;
    longitude: number;
    specialties: DoctorSpecialtyEnum[]
    middleName: string;
    secondSurname: string;
}
//#endregion

export class RegisterDoctorApplicationService implements IApplicationService<RegisterDoctorApplicationServiceRequest, string> {
    get name(): string { return this.constructor.name; }

    constructor(private readonly eventHandler: IEventHandler, private readonly patientRepository: IDoctorRepository) { }

    async execute(dto: RegisterDoctorApplicationServiceRequest): Promise<Result<string>> {
        //Creamos las especialidades
        const specialties: DoctorSpecialty[] = [];
        dto.specialties.forEach((specialty) => {
            specialties.push(DoctorSpecialty.create(specialty));
        });

        //Creamos el paciente
        const doctor = Doctor.create(
            DoctorId.create(dto.id),
            DoctorNames.create(dto.firstName, dto.middleName),
            DoctorSurnames.create(dto.firstSurname, dto.secondSurname),
            DoctorLocation.create(dto.latitude, dto.longitude),
            DoctorRating.create(0),
            DoctorGender.create(dto.gender),
            DoctorStatus.create(DoctorStatusEnum.ACTIVE),
            specialties
        );

        //Hacemos persistente el paciente
        this.patientRepository.saveAggregate(doctor);

        //Publicamos los eventos
        this.eventHandler.publish(doctor.pullEvents());

        //Retornamos
        return Result.success("Doctor registrado exitosamente");
    }
}
