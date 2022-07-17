import { PatientAllergies } from "../../../patient/domain/value-objects/patient-allergies";
import { PatientBackground } from "../../../patient/domain/value-objects/patient-background";
import { PatientBirthdate } from "../../../patient/domain/value-objects/patient-birthdate";
import { PatientHeight } from "../../../patient/domain/value-objects/patient-height";
import { PatientWeight } from "../../../patient/domain/value-objects/patient-weight";
import { PatientPhoneNumber } from "../../../patient/domain/value-objects/patient-phone-number";
import { PatientSurgeries } from "../../../patient/domain/value-objects/patient-surgeries";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { PatientNames } from "../../../patient/domain/value-objects/patient-names";
import { PatientSurnames } from "../../../patient/domain/value-objects/patient-surnames";
import { Patient } from "../../../patient/domain/patient";
import { OrmPatient } from "../entities/orm-patient.entity";
import { IMapper } from "../../../core/application/mappers/mapper.interface";
import { PatientStatusEnum } from "src/patient/domain/value-objects/patient-status.enum";
import { PatientGenderEnum } from "src/patient/domain/value-objects/patient-gender.enum";
import { PatientStatus } from "src/patient/domain/value-objects/patient-status";
import { PatientGender } from "src/patient/domain/value-objects/patient-gender";

export class OrmPatientMapper implements IMapper<Patient, OrmPatient> {

    async fromDomainToOther(domain: Patient): Promise<OrmPatient> {
        if (!domain) { return null; }

        const ormPatient: OrmPatient = await OrmPatient.create(
            domain.Id.Value,
            domain.Names.FirstName,
            domain.SurNames.FirstSurname,
            domain.Gender.Value,
            domain.Status.Value,
            domain.Allergies.Value,
            domain.Backgorund.Value,
            domain.BirthDate.Value,
            domain.Height.Value,
            domain.Weight.Value,
            domain.PhoneNumber.Value,
            domain.Surgeries.Value,
            domain.Names.MiddleName,
            domain.SurNames.SecondSurname);
        return ormPatient;
    }
    //Arreglar convertir los enums en value-objects
    async fromOtherToDomain(other: OrmPatient): Promise<Patient> {
        if (!other) { return null; }

        const patient: Patient = Patient.create(
            PatientId.create(other.id),
            PatientNames.create(other.firstName, other.middleName),
            PatientSurnames.create(other.firstSurname, other.middleName),
            PatientBirthdate.create(other.birthdate),
            PatientAllergies.create(other.allergies),
            PatientBackground.create(other.background),
            PatientHeight.create(other.height),
            PatientPhoneNumber.create(other.phoneNumber),
            PatientStatus.create(PatientStatusEnum.ACTIVE),
            PatientWeight.create(other.weight),
            PatientSurgeries.create(other.surgeries),
            PatientGender.create(PatientGenderEnum.MALE)
        );

        patient.pullEvents();

        return patient;
    }


}
