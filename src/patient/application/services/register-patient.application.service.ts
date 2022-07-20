import { Result } from "../../../core/application/result-handler/result";
import { PatientGenderEnum } from "../../../patient/domain/value-objects/patient-gender.enum";
import { PatientStatusEnum } from "../../../patient/domain/value-objects/patient-status.enum";
import { IApplicationService } from "../../../core/application/application-service/application.service.interface";
import { IEventHandler } from "../../../core/application/event-handler/event-handler.interface";
import { Patient } from "../../../patient/domain/patient";
import { PatientAllergies } from "../../../patient/domain/value-objects/patient-allergies";
import { PatientBackground } from "../../../patient/domain/value-objects/patient-background";
import { PatientBirthdate } from "../../../patient/domain/value-objects/patient-birthdate";
import { PatientGender } from "../../../patient/domain/value-objects/patient-gender";
import { PatientHeight } from "../../../patient/domain/value-objects/patient-height";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { PatientNames } from "../../../patient/domain/value-objects/patient-names";
import { PatientPhoneNumber } from "../../../patient/domain/value-objects/patient-phone-number";
import { PatientStatus } from "../../../patient/domain/value-objects/patient-status";
import { PatientSurgeries } from "../../../patient/domain/value-objects/patient-surgeries";
import { PatientSurnames } from "../../../patient/domain/value-objects/patient-surnames";
import { PatientWeight } from "../../../patient/domain/value-objects/patient-weight";
import { IPatientRepository } from "../repositories/patient.repository.interface";
import { IUUIDGenerator } from "../../../core/application/uuid/uuid-generator.interface";

//#region Service DTOs
export interface RegisterPatientApplicationServiceDto {
    firstName?: string;
    middleName?: string;
    firstSurname?: string;
    secondSurname?: string;
    allergies?: string;
    background?: string;
    birthdate?: Date;
    height?: number;
    phoneNumber?: string;
    weight?: number;
    surgeries?: string;
    gender?: PatientGenderEnum;
}
//#endregion

export class RegisterPatientApplicationService implements IApplicationService<RegisterPatientApplicationServiceDto, string> {
    get name(): string { return this.constructor.name; }

    constructor(
        private readonly eventHandler: IEventHandler,
        private readonly uuidGenerator: IUUIDGenerator,
        private readonly patientRepository: IPatientRepository
    ) { }

    async execute(dto: RegisterPatientApplicationServiceDto): Promise<Result<string>> {

        //Creamos el paciente
        const patient = Patient.create(
            PatientId.create(this.uuidGenerator.generate()),
            PatientNames.create(dto.firstName, dto.middleName),
            PatientSurnames.create(dto.firstSurname, dto.secondSurname),
            PatientBirthdate.create(dto.birthdate),
            PatientAllergies.create(dto.allergies),
            PatientBackground.create(dto.background),
            PatientHeight.create(dto.height),
            PatientPhoneNumber.create(dto.phoneNumber),
            PatientStatus.create(PatientStatusEnum.ACTIVE),
            PatientWeight.create(dto.weight),
            PatientSurgeries.create(dto.surgeries),
            PatientGender.create(dto.gender)
        );

        //Hacemos persistente el paciente
        this.patientRepository.saveAggregate(patient);

        //Publicamos los eventos
        this.eventHandler.publish(patient.pullEvents());

        //Retornamos
        return Result.success("Usuario registrado exitosamente");
    }
}
