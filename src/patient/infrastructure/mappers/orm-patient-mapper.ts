import { PatientGender } from "../../../patient/domain/value-objects/patient-gender";
import { PatientStatus } from "../../../patient/domain/value-objects/patient-status";
import { PatientAllergies } from "src/patient/domain/value-objects/patient-allergies";
import { PatientBackground } from "src/patient/domain/value-objects/patient-background";
import { PatientBirthdate } from "src/patient/domain/value-objects/patient-birthdate";
import { PatientHeight } from "src/patient/domain/value-objects/patient-height";
import { PatientWeight } from "src/patient/domain/value-objects/patient-weight";
import { PatientPhoneNumber } from "src/patient/domain/value-objects/patient-phone-number";
import { PatientSurgeries } from "src/patient/domain/value-objects/patient-surgeries";
import { PatientId } from "src/patient/domain/value-objects/patient-id";
import { PatientNames } from "src/patient/domain/value-objects/patient-names";
import { PatientSurnames } from "src/patient/domain/value-objects/patient-surnames";
import { Patient } from "../../../patient/domain/patient";
import { OrmPatient } from "../entities/orm-patient.entity";
import { IMapper } from "src/core/application/mappers/mapper.interface";


export class OrmPatientMapper implements IMapper<Patient, OrmPatient> {

    async fromDomainToOther(domain: Patient): Promise<OrmPatient> {
        const ormPatient: OrmPatient = await OrmPatient.create(
            domain.Id.Value,
            domain.Names.FirstName,
            domain.SurNames.FirstSurname,
            domain.Gender,
            domain.Status,
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
        const patient: Patient = Patient.create(
            PatientId.create(other.id),
            PatientNames.create(other.firstName, other.middleName),
            PatientSurnames.create(other.firstSurname, other.middleName),
            PatientBirthdate.create(other.birthdate),
            PatientAllergies.create(other.allergies),
            PatientBackground.create(other.background),
            PatientHeight.create(other.height),
            PatientPhoneNumber.create(other.phoneNumber),
            PatientStatus.ACTIVE,
            PatientWeight.create(other.weight),
            PatientSurgeries.create(other.surgeries),
            PatientGender.MALE);

        patient.pullEvents();

        return patient; 
    }

        
}
