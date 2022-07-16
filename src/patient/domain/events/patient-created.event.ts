import { DomainEvent } from "../../../core/domain/domain-events/domain-event";
import { PatientId } from "../value-objects/patient-id";
import { PatientNames } from "../value-objects/patient-names";
import { PatientBirthdate } from "../value-objects/patient-birthdate";
import { PatientAllergies } from "../value-objects/patient-allergies";
import { PatientBackground } from "../value-objects/patient-background";
import { PatientGender } from "../value-objects/patient-gender";
import { PatientHeight } from "../value-objects/patient-height";
import { PatientPhoneNumber } from "../value-objects/patient-phone-number";
import { PatientStatus } from "../value-objects/patient-status";
import { PatientWeight } from "../value-objects/patient-weight";
import { PatientSurgeries } from "../value-objects/patient-surgeries";
import { PatientSurnames } from "../value-objects/patient-surnames";


export class PatientCreated extends DomainEvent {
    protected constructor(
        public id: PatientId,
        public names: PatientNames,
        public surnames: PatientSurnames,
        public birthdate: PatientBirthdate,
        public allergies: PatientAllergies,
        public background: PatientBackground,
        public height: PatientHeight,
        public phoneNumber: PatientPhoneNumber,
        public status: PatientStatus,
        public weight: PatientWeight,
        public surgeries: PatientSurgeries,
        public gender: PatientGender
        )
        {
            super();
        }

    static create(
         id: PatientId,
         names: PatientNames,
         surnames: PatientSurnames,
         birthdate: PatientBirthdate,
         allergies: PatientAllergies,
         background: PatientBackground,
         height: PatientHeight,
         phoneNumber: PatientPhoneNumber,
         status: PatientStatus,
         weight: PatientWeight,
         surgeries: PatientSurgeries,
         gender: PatientGender
    ): PatientCreated {
        return new PatientCreated(
            id,
            names,
            surnames,
            birthdate,
            allergies,
            background,
            height,
            phoneNumber,
            status,
            weight,
            surgeries,
            gender
        );
    }
}